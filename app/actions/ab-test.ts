'use server';

import { db } from '@/db';
import { abTests, abTestVariants } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getAbTests() {
    try {
        const tests = await db.query.abTests.findMany({
            orderBy: [desc(abTests.updatedAt)],
            with: {
                variants: true, // We need to define relations first!
            }
        });
        return tests;
    } catch (error) {
        console.error('Failed to fetch A/B tests:', error);
        return [];
    }
}

export async function getAbTest(id: string) {
    try {
        const test = await db.query.abTests.findFirst({
            where: eq(abTests.id, id),
            with: {
                variants: {
                    with: {
                        quiz: true
                    }
                }
            }
        });
        return test;
    } catch (error) {
        console.error('Failed to fetch A/B test:', error);
        return null;
    }
}

export async function getAbTestBySlug(slug: string) {
    try {
        const test = await db.query.abTests.findFirst({
            where: eq(abTests.slug, slug),
            with: {
                variants: {
                    with: {
                        quiz: true
                    }
                }
            }
        });
        return test;
    } catch (error) {
        console.error('Failed to fetch A/B test by slug:', error);
        return null;
    }
}

export async function saveAbTest(data: {
    id?: string;
    name: string;
    slug: string;
    status: 'draft' | 'active' | 'stopped';
    variants: { quizId: string; trafficPercentage: number }[];
}) {
    try {
        // 1. Upsert Test
        const [savedTest] = await db.insert(abTests).values({
            id: data.id,
            name: data.name,
            slug: data.slug,
            status: data.status,
            updatedAt: new Date(),
        }).onConflictDoUpdate({
            target: abTests.id,
            set: {
                name: data.name,
                slug: data.slug,
                status: data.status,
                updatedAt: new Date(),
            },
        }).returning();

        if (!savedTest) throw new Error('Failed to save test');

        // 2. Handle Variants
        if (data.id) {
            await db.delete(abTestVariants).where(eq(abTestVariants.testId, data.id));
        }

        if (data.variants.length > 0) {
            await db.insert(abTestVariants).values(
                data.variants.map(v => ({
                    testId: savedTest.id,
                    quizId: v.quizId,
                    trafficPercentage: v.trafficPercentage,
                }))
            );
        }

        revalidatePath('/admin/ab-tests');
        return { success: true, testId: savedTest.id };
    } catch (error) {
        console.error('Failed to save A/B test:', error);
        return { success: false, error: 'Failed to save A/B test' };
    }
}

export async function deleteAbTest(id: string) {
    try {
        await db.delete(abTestVariants).where(eq(abTestVariants.testId, id));
        await db.delete(abTests).where(eq(abTests.id, id));
        revalidatePath('/admin/ab-tests');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete A/B test:', error);
        return { success: false, error: 'Failed to delete A/B test' };
    }
}
