'use server';

import { db } from '@/db';
import { responses, leads, quizzes, quizInteractions } from '@/db/schema';
import { eq, desc, sql, avg, count, and } from 'drizzle-orm';

export async function getQuizStats(quizId: string) {
    try {
        const [stats] = await db
            .select({
                totalResponses: count(responses.id),
                avgTimeTaken: avg(responses.timeTaken),
            })
            .from(responses)
            .where(eq(responses.quizId, quizId));

        return {
            totalResponses: stats?.totalResponses || 0,
            avgTimeTaken: stats?.avgTimeTaken ? Math.round(Number(stats.avgTimeTaken)) : 0,
        };
    } catch (error) {
        console.error('Failed to fetch quiz stats:', error);
        return { totalResponses: 0, avgTimeTaken: 0 };
    }
}

export async function getQuizLeads(quizId: string) {
    try {
        const quizLeads = await db.query.leads.findMany({
            where: eq(leads.quizId, quizId),
            orderBy: [desc(leads.createdAt)],
        });
        return quizLeads;
    } catch (error) {
        console.error('Failed to fetch quiz leads:', error);
        return [];
    }
}

export async function getQuizResponses(quizId: string) {
    try {
        const quizResponses = await db.query.responses.findMany({
            where: eq(responses.quizId, quizId),
            with: {
                lead: true,
            },
            orderBy: [desc(responses.completedAt)],
        });
        return quizResponses;
    } catch (error) {
        console.error('Failed to fetch quiz responses:', error);
        return [];
    }
}

export async function getGlobalStats() {
    try {
        const [responseStats] = await db
            .select({
                totalResponses: count(responses.id),
                avgTimeTaken: avg(responses.timeTaken),
            })
            .from(responses);

        const [leadStats] = await db
            .select({
                totalLeads: count(leads.id),
            })
            .from(leads);

        const [quizStats] = await db
            .select({
                totalQuizzes: count(quizzes.id),
            })
            .from(quizzes);

        return {
            totalResponses: responseStats?.totalResponses || 0,
            avgTimeTaken: responseStats?.avgTimeTaken ? Math.round(Number(responseStats.avgTimeTaken)) : 0,
            totalLeads: leadStats?.totalLeads || 0,
            totalQuizzes: quizStats?.totalQuizzes || 0,
        };
    } catch (error) {
        console.error('Failed to fetch global stats:', error);
        return { totalResponses: 0, avgTimeTaken: 0, totalLeads: 0, totalQuizzes: 0 };
    }
}

export async function getAllLeads() {
    try {
        const allLeads = await db.query.leads.findMany({
            with: {
                quiz: {
                    with: {
                        questions: true,
                    }
                },
                responses: true,
            },
            orderBy: [desc(leads.createdAt)],
        });
        return allLeads;
    } catch (error) {
        console.error('Failed to fetch all leads:', error);
        return [];
    }
}

export async function trackEvent(data: {
    quizId: string;
    sessionId: string;
    type: string;
    metadata?: any;
}) {
    try {
        await db.insert(quizInteractions).values({
            quizId: data.quizId,
            sessionId: data.sessionId,
            type: data.type,
            metadata: data.metadata,
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to track event:', error);
        return { success: false };
    }
}

export async function getFunnelData(quizId: string) {
    try {
        // Get all interactions for this quiz
        const interactions = await db
            .select({
                type: quizInteractions.type,
                metadata: quizInteractions.metadata,
                count: count(quizInteractions.id),
            })
            .from(quizInteractions)
            .where(eq(quizInteractions.quizId, quizId))
            .groupBy(quizInteractions.type, quizInteractions.metadata);

        // Process into funnel steps
        return interactions.map(i => ({
            step: i.type === 'view' ? `Question ${(i.metadata as any)?.questionId || '?'}` : i.type,
            count: i.count,
        }));
    } catch (error) {
        console.error('Failed to fetch funnel data:', error);
        return [];
    }
}

export async function getScoreDistribution(quizId: string) {
    try {
        const scores = await db
            .select({
                score: leads.score,
            })
            .from(leads)
            .where(and(eq(leads.quizId, quizId), sql`${leads.score} IS NOT NULL`));

        // Bucket scores
        const distribution: Record<string, number> = {};
        scores.forEach(s => {
            const score = s.score || 0;
            const bucket = Math.floor(score / 10) * 10; // Bucket by 10s
            const key = `${bucket}-${bucket + 9}`;
            distribution[key] = (distribution[key] || 0) + 1;
        });

        return Object.entries(distribution).map(([range, count]) => ({
            range,
            count,
        })).sort((a, b) => parseInt(a.range) - parseInt(b.range));
    } catch (error) {
        console.error('Failed to fetch score distribution:', error);
        return [];
    }
}
