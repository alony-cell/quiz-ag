import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from '@/db';
import { questions } from '@/db/schema';

async function main() {
    try {
        console.log('Checking questions in database...');
        const allQuestions = await db.select().from(questions);
        console.log(`Found ${allQuestions.length} questions.`);
        if (allQuestions.length > 0) {
            console.log('Sample question:', allQuestions[0]);
        }
    } catch (error) {
        console.error('Error checking DB:', error);
    }
}

main();
