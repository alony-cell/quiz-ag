'use server';

import { db } from '@/db';
import { responses, leads, quizzes } from '@/db/schema';
import { eq, desc, sql, avg, count } from 'drizzle-orm';

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
                    columns: {
                        title: true,
                    }
                }
            },
            orderBy: [desc(leads.createdAt)],
        });
        return allLeads;
    } catch (error) {
        console.error('Failed to fetch all leads:', error);
        return [];
    }
}
