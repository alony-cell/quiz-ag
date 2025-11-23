'use server';

import { db } from '@/db';
import { responses, leads } from '@/db/schema';
import { syncLeadToIntegrations } from '@/app/actions/integration';

export async function submitResponse(data: {
    quizId: string;
    answers: Record<string, any>;
    timeTaken?: number;
    lead?: {
        email?: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
        country?: string;
        metadata?: any;
        hiddenData?: any;
        score?: number;
        outcome?: string;
    };
}) {
    try {
        let leadId = null;

        // 1. Save Lead if provided
        if (data.lead && (data.lead.email || data.lead.phone)) {
            try {
                // Check for existing lead
                let existingLead = undefined;
                if (data.lead.email) {
                    existingLead = await db.query.leads.findFirst({
                        where: (leads, { and, eq }) => and(
                            eq(leads.quizId, data.quizId),
                            eq(leads.email, data.lead!.email!)
                        ),
                    });
                }

                if (existingLead) {
                    leadId = existingLead.id;
                    // Optional: Update existing lead with new data
                } else {
                    const [savedLead] = await db.insert(leads).values({
                        quizId: data.quizId,
                        email: data.lead.email || null,
                        firstName: data.lead.firstName || null,
                        lastName: data.lead.lastName || null,
                        phone: data.lead.phone || null,
                        country: data.lead.country || null,
                        metadata: data.lead.metadata || {},
                        hiddenData: data.lead.hiddenData || {},
                        score: data.lead.score || 0,
                        outcome: data.lead.outcome || null,
                    }).returning({ id: leads.id });

                    if (savedLead) {
                        leadId = savedLead.id;
                        // Trigger sync safely
                        try {
                            await syncLeadToIntegrations(leadId, data.quizId);
                        } catch (syncError) {
                            console.error('Failed to sync lead to integrations:', syncError);
                        }
                    }
                }
            } catch (leadError) {
                console.error('Failed to save lead:', leadError);
                // Continue to save response even if lead save fails
            }
        }

        // 2. Save Response
        await db.insert(responses).values({
            quizId: data.quizId,
            leadId: leadId,
            answers: data.answers,
            timeTaken: data.timeTaken,
        });

        return { success: true };
    } catch (error) {
        console.error('Failed to submit response:', error);
        return { success: false, error: 'Failed to submit response' };
    }
}
