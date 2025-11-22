'use server';

import { db } from '@/db';
import { quizzes, questions } from '@/db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { Quiz, Question } from '@/types';

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

export async function saveQuiz(quizData: Partial<Quiz> & { questions: Question[] }) {
    try {
        // 1. Upsert Quiz
        const [savedQuiz] = await db.insert(quizzes).values({
            id: quizData.id,
            title: quizData.title || 'Untitled Quiz',
            description: quizData.description,
            design: quizData.design,
            isActive: quizData.isActive ?? true,
            updatedAt: new Date(),
        }).onConflictDoUpdate({
            target: quizzes.id,
            set: {
                title: quizData.title,
                description: quizData.description,
                design: quizData.design,
                isActive: quizData.isActive,
                updatedAt: new Date(),
            },
        }).returning();

        if (!savedQuiz) throw new Error('Failed to save quiz');

        // 2. Delete existing questions (simple strategy for now: replace all)
        if (quizData.id) {
            await db.delete(questions).where(eq(questions.quizId, quizData.id));
        }

        // 3. Insert new questions
        if (quizData.questions && quizData.questions.length > 0) {
            await db.insert(questions).values(
                quizData.questions.map((q, index) => ({
                    id: q.id,
                    quizId: savedQuiz.id,
                    text: q.text,
                    description: q.description,
                    imageUrl: q.imageUrl,
                    type: q.type,
                    order: index, // Ensure order is preserved
                    options: q.options,
                    structure: q.structure,
                    isRequired: q.isRequired,
                    allowBack: q.allowBack,
                    buttonText: q.buttonText,
                }))
            );
        }

        revalidatePath('/admin/quizzes');
        revalidatePath(`/admin/quizzes/${savedQuiz.id}`);

        return { success: true, quizId: savedQuiz.id };
    } catch (error) {
        console.error('Failed to save quiz:', error);
        return { success: false, error: 'Failed to save quiz' };
    }
}

export async function deleteQuiz(id: string) {
    try {
        await db.delete(questions).where(eq(questions.quizId, id));
        await db.delete(quizzes).where(eq(quizzes.id, id));
        revalidatePath('/admin/quizzes');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete quiz:', error);
        return { success: false, error: 'Failed to delete quiz' };
    }
}
