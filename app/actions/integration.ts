'use server';

import { db } from '@/db';
import { integrations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getIntegrations(quizId: string) {
    try {
        const quizIntegrations = await db.query.integrations.findMany({
            where: eq(integrations.quizId, quizId),
        });
        return quizIntegrations;
    } catch (error) {
        console.error('Failed to fetch integrations:', error);
        return [];
    }
}

export async function saveIntegration(data: {
    id?: string;
    quizId: string;
    type: string;
    config: any;
    isActive: boolean;
}) {
    try {
        const [savedIntegration] = await db.insert(integrations).values({
            id: data.id,
            quizId: data.quizId,
            type: data.type,
            config: data.config,
            isActive: data.isActive,
        }).onConflictDoUpdate({
            target: integrations.id,
            set: {
                config: data.config,
                isActive: data.isActive,
            },
        }).returning();

        revalidatePath(`/admin/quizzes/${data.quizId}/integrations`);
        return { success: true, integration: savedIntegration };
    } catch (error) {
        console.error('Failed to save integration:', error);
        return { success: false, error: 'Failed to save integration' };
    }
}

export async function deleteIntegration(id: string, quizId: string) {
    try {
        await db.delete(integrations).where(eq(integrations.id, id));
        revalidatePath(`/admin/quizzes/${quizId}/integrations`);
        return { success: true };
    } catch (error) {
        console.error('Failed to delete integration:', error);
        return { success: false, error: 'Failed to delete integration' };
    }
}

import { sendFacebookEvent } from '@/lib/facebook';
import { leads } from '@/db/schema';
import { FacebookIntegration } from '@/types';

export async function syncLeadToIntegrations(leadId: string, quizId: string) {
    try {
        const lead = await db.query.leads.findFirst({
            where: eq(leads.id, leadId),
        });

        if (!lead) return { success: false, error: 'Lead not found' };

        const activeIntegrations = await getIntegrations(quizId);

        for (const integration of activeIntegrations) {
            if (integration.isActive) {
                if (integration.type === 'facebook_pixel') {
                    const config = integration.config as FacebookIntegration;
                    if (config.events?.lead) {
                        await sendFacebookEvent(
                            config.pixelId,
                            config.accessToken,
                            'Lead',
                            {
                                email: lead.email || undefined,
                                phone: lead.phone || undefined,
                                firstName: lead.firstName || undefined,
                                lastName: lead.lastName || undefined,
                                country: lead.country || undefined,
                            },
                            {
                                lead_id: lead.id,
                                quiz_id: quizId,
                                value: 0,
                                currency: 'USD'
                            },
                            config.testEventCode
                        );
                    }
                }
                // Add other integrations here (e.g. HubSpot)
            }
        }
        return { success: true };
    } catch (error) {
        console.error('Failed to sync lead:', error);
        return { success: false, error };
    }
}

export async function trackQuizCompletion(quizId: string, leadId: string | null, answers: any) {
    try {
        const activeIntegrations = await getIntegrations(quizId);

        let userData: any = {};
        if (leadId) {
            const lead = await db.query.leads.findFirst({
                where: eq(leads.id, leadId),
            });
            if (lead) {
                userData = {
                    email: lead.email || undefined,
                    phone: lead.phone || undefined,
                    firstName: lead.firstName || undefined,
                    lastName: lead.lastName || undefined,
                    country: lead.country || undefined,
                };
            }
        }

        for (const integration of activeIntegrations) {
            if (integration.isActive && integration.type === 'facebook_pixel') {
                const config = integration.config as FacebookIntegration;
                if (config.events?.complete) {
                    await sendFacebookEvent(
                        config.pixelId,
                        config.accessToken,
                        'CompleteRegistration',
                        userData,
                        {
                            content_name: 'Quiz Completion',
                            quiz_id: quizId,
                            lead_id: leadId,
                        },
                        config.testEventCode
                    );
                }
            }
        }
        return { success: true };
    } catch (error) {
        console.error('Failed to track completion:', error);
        return { success: false, error };
    }
}
