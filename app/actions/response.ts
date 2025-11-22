'use server';

import { db } from '@/db';
import { responses, leads } from '@/db/schema';

export async function submitResponse(data: {
    quizId: string;
    answers: Record<string, any>;
    timeTaken?: number;
    lead?: {
        email?: string;
        name?: string;
        phone?: string;
        metadata?: any;
    };
}) {
    try {
        let leadId = null;

        // 1. Save Lead if provided
        if (data.lead && (data.lead.email || data.lead.phone)) {
            const [savedLead] = await db.insert(leads).values({
                quizId: data.quizId,
                email: data.lead.email,
                name: data.lead.name,
                phone: data.lead.phone,
                metadata: data.lead.metadata,
            }).returning({ id: leads.id });

            if (savedLead) {
                leadId = savedLead.id;
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
