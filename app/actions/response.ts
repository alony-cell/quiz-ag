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
        name?: string;
        phone?: string;
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
            // Check for existing lead
            const existingLead = await db.query.leads.findFirst({
                where: (leads, { and, eq }) => and(
                    eq(leads.quizId, data.quizId),
                    eq(leads.email, data.lead!.email!)
                ),
            });

            if (existingLead) {
                leadId = existingLead.id;
                // Optional: Update existing lead with new data
            } else {
                const [savedLead] = await db.insert(leads).values({
                    quizId: data.quizId,
                    email: data.lead.email,
                    name: data.lead.name,
                    phone: data.lead.phone,
                    metadata: data.lead.metadata,
                    hiddenData: data.lead.hiddenData,
                    score: data.lead.score,
                    outcome: data.lead.outcome,
                }).returning({ id: leads.id });

                if (savedLead) {
                    leadId = savedLead.id;
                    // Trigger sync (fire and forget or await?)
                    // For server actions, better to await or use background job.
                    // We'll await for now to ensure it runs.
                    await syncLeadToIntegrations(leadId, data.quizId);
                }
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
