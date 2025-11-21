import QuizEngine from '@/components/quiz/QuizEngine';
import { Quiz } from '@/types';

// Mock Data Fetcher
const getQuizBySlug = (slug: string): Quiz => {
    return {
        id: '1',
        slug,
        title: 'Marketing Strategy Quiz',
        description: 'Assess your marketing maturity.',
        isActive: true,
        createdAt: new Date().toISOString(),
        questions: [
            {
                id: 'q1',
                quizId: '1',
                text: 'What is your primary marketing goal?',
                type: 'multiple_choice',
                order: 1,
                isActive: true,
                options: [
                    { value: 'awareness', label: 'Brand Awareness' },
                    { value: 'leads', label: 'Lead Generation' },
                    { value: 'sales', label: 'Direct Sales' },
                ],
            },
            {
                id: 'q2',
                quizId: '1',
                text: 'How large is your marketing team?',
                type: 'multiple_choice',
                order: 2,
                isActive: true,
                options: [
                    { value: '1-5', label: '1-5 People' },
                    { value: '6-20', label: '6-20 People' },
                    { value: '20+', label: '20+ People' },
                ],
            },
        ],
    };
};

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const quiz = getQuizBySlug(slug);

    const design = quiz.design || {
        colors: { primary: '#2563eb', background: '#f8fafc', text: '#0f172a', accent: '#3b82f6', gradient: undefined },
    };

    return (
        <div
            className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
            style={{
                backgroundColor: design.colors.background,
                backgroundImage: design.colors.gradient,
            }}
        >
            <div className="max-w-3xl mx-auto text-center mb-12">
                <h1
                    className="text-3xl font-extrabold sm:text-4xl mb-4"
                    style={{ color: design.colors.text }}
                >
                    {quiz.title}
                </h1>
                <p
                    className="text-lg opacity-80"
                    style={{ color: design.colors.text }}
                >
                    {quiz.description}
                </p>
            </div>

            <QuizEngine quiz={quiz} />
        </div>
    );
}
