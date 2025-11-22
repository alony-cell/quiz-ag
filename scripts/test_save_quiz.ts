// test_save_quiz.ts
import { saveQuiz, getQuiz } from '../app/actions/quiz';

async function main() {
    const quizData = {
        title: 'Test Quiz',
        slug: 'test-quiz',
        description: 'A quiz for testing',
        isActive: true,
        design: null,
        questions: [
            {
                id: crypto.randomUUID(),
                quizId: '',
                text: 'Sample Question?',
                description: '',
                imageUrl: '',
                type: 'multiple_choice',
                order: 0,
                options: [{ value: 'opt1', label: 'Option 1' }],
                structure: [],
                isRequired: true,
                allowBack: false,
                buttonText: '',
                isActive: true,
            },
        ],
    } as any;

    const result = await saveQuiz(quizData);
    console.log('saveQuiz result:', result);
    if (result.success && result.quizId) {
        const fetched = await getQuiz(result.quizId);
        console.log('Fetched quiz:', JSON.stringify(fetched, null, 2));
    }
}

main().catch(console.error);
