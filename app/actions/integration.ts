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

export async function syncLeadToIntegrations(leadId: string, quizId: string) {
    // Mock implementation
    console.log(`Syncing lead ${leadId} for quiz ${quizId} to integrations...`);
    const activeIntegrations = await getIntegrations(quizId);

    for (const integration of activeIntegrations) {
        if (integration.isActive) {
            console.log(`Syncing to ${integration.type}...`);
            // Actual sync logic would go here
        }
    }
    return { success: true };
}
