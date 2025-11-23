'use server';

import { db } from '@/db';
import { quizzes, questions, thankYouPages } from '@/db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { Quiz, Question } from '@/types';

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

export async function getQuizzes() {
    try {
        const allQuizzes = await db.query.quizzes.findMany({
            orderBy: [desc(quizzes.updatedAt)],
        });
        return allQuizzes;
    } catch (error) {
        console.error('Failed to fetch quizzes:', error);
        throw new Error('Failed to fetch quizzes');
    }
}

export async function getQuiz(id: string) {
    try {
        const quiz = await db.query.quizzes.findFirst({
            where: eq(quizzes.id, id),
            with: {
                questions: {
                    orderBy: [asc(questions.order)],
                },
                thankYouPages: true,
            },
        });

        if (!quiz) return null;

        // Transform DB structure to App structure if needed
        // The DB stores options/structure as JSON, which Drizzle should handle automatically
        return quiz;
    } catch (error) {
        console.error('Failed to fetch quiz:', error);
        throw new Error('Failed to fetch quiz');
    }
}

export async function getQuizBySlug(slug: string) {
    try {
        const quiz = await db.query.quizzes.findFirst({
            where: eq(quizzes.slug, slug),
            with: {
                questions: {
                    orderBy: [asc(questions.order)],
                },
                thankYouPages: true,
            },
        });

        if (!quiz) return null;
        return quiz;
    } catch (error) {
        console.error('Failed to fetch quiz by slug:', error);
        throw new Error('Failed to fetch quiz by slug');
    }
}

export async function saveQuiz(quizData: Partial<Quiz> & { questions: Question[] }) {
    try {
        console.log('saveQuiz called with:', {
            id: quizData.id,
            questionsCount: quizData.questions?.length,
            isActive: quizData.isActive,
            firstQuestion: quizData.questions?.[0]
        });
        // 1. Upsert Quiz
        const slug = quizData.slug || generateSlug(quizData.title || 'untitled-quiz');

        const [savedQuiz] = await db.insert(quizzes).values({
            id: quizData.id,
            title: quizData.title || 'Untitled Quiz',
            slug: slug,
            description: quizData.description,
            design: quizData.design,
            settings: quizData.settings,
            isActive: quizData.isActive ?? true,
            updatedAt: new Date(),
        }).onConflictDoUpdate({
            target: quizzes.id,
            set: {
                title: quizData.title,
                slug: slug,
                description: quizData.description,
                design: quizData.design,
                settings: quizData.settings,
                isActive: quizData.isActive,
                updatedAt: new Date(),
            },
        }).returning();

        if (!savedQuiz) throw new Error('Failed to save quiz');

        console.log('Quiz saved, now deleting old questions...');

        // 2. Delete existing questions (simple strategy for now: replace all)
        if (quizData.id) {
            await db.delete(questions).where(eq(questions.quizId, quizData.id));
        }

        console.log('Old questions deleted, inserting new questions...');

        // 3. Insert new questions
        if (quizData.questions && quizData.questions.length > 0) {
            console.log('Inserting questions:', quizData.questions.map(q => ({
                id: q.id,
                text: q.text,
                type: q.type,
                isActive: q.isActive
            })));

            await db.insert(questions).values(
                quizData.questions.map((q, index) => {
                    // Ensure a valid UUID for the question ID; if the client provided an invalid ID, generate a new one
                    const isValidUuid = typeof q.id === 'string' && /^[0-9a-fA-F-]{36}$/.test(q.id);
                    const questionId = isValidUuid ? q.id : crypto.randomUUID();
                    return {
                        id: questionId,
                        quizId: savedQuiz.id,
                        text: q.text,
                        description: q.description,
                        imageUrl: q.imageUrl,
                        type: q.type,
                        order: index, // Ensure order is preserved
                        options: q.options,
                        structure: q.structure,
                        isRequired: q.isRequired ?? true,
                        allowBack: q.allowBack ?? false,
                        buttonText: q.buttonText,
                        isActive: q.isActive !== undefined ? q.isActive : true, // Ensure isActive is always set
                    };
                })
            );

            console.log('Questions inserted successfully');
        }

        // 4. Handle Thank You Pages
        if (quizData.id) {
            await db.delete(thankYouPages).where(eq(thankYouPages.quizId, quizData.id));
        }

        if (quizData.thankYouPages && quizData.thankYouPages.length > 0) {
            await db.insert(thankYouPages).values(
                quizData.thankYouPages.map((p) => ({
                    id: p.id,
                    quizId: savedQuiz.id,
                    title: p.title,
                    content: p.content,
                    buttonText: p.buttonText,
                    buttonUrl: p.buttonUrl,
                    scoreRangeMin: p.scoreRangeMin,
                    scoreRangeMax: p.scoreRangeMax,
                    imageUrl: p.imageUrl,
                }))
            );
        }

        revalidatePath('/admin/quizzes');
        revalidatePath(`/admin/quizzes/${savedQuiz.id}`);

        console.log('Save completed successfully');
        return { success: true, quizId: savedQuiz.id };
    } catch (error) {
        console.error('Failed to save quiz - ERROR DETAILS:', error);
        console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        return { success: false, error: 'Failed to save quiz' };
    }
}

export async function deleteQuiz(id: string) {
    try {
        await db.delete(questions).where(eq(questions.quizId, id));
        await db.delete(thankYouPages).where(eq(thankYouPages.quizId, id));
        await db.delete(quizzes).where(eq(quizzes.id, id));
        revalidatePath('/admin/quizzes');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete quiz:', error);
        return { success: false, error: 'Failed to delete quiz' };
    }
}
