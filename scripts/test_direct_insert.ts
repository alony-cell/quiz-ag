import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from '@/db';
import { quizzes, questions } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    try {
        console.log('Testing direct DB insert...');

        // 1. Create a quiz
        const quizId = crypto.randomUUID();
        const [savedQuiz] = await db.insert(quizzes).values({
            id: quizId,
            title: 'Direct Insert Test Quiz',
            slug: 'direct-insert-test',
            description: 'Testing direct insert',
            isActive: true,
            updatedAt: new Date(),
        }).returning();
        console.log('Quiz saved:', savedQuiz.id);

        // 2. Create a question
        const questionId = crypto.randomUUID();
        const [savedQuestion] = await db.insert(questions).values({
            id: questionId,
            quizId: savedQuiz.id,
            text: 'Direct Insert Question?',
            type: 'multiple_choice',
            order: 0,
            options: [{ value: 'yes', label: 'Yes' }],
            isActive: true,
            isRequired: true,
            allowBack: false,
        }).returning();
        console.log('Question saved:', savedQuestion.id);

    } catch (error) {
        console.error('Error inserting:', error);
    }
}

main();
