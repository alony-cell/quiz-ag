import QuizEngine from '@/components/quiz/QuizEngine';
import { getQuizBySlug } from '@/app/actions/quiz';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const quiz = await getQuizBySlug(slug);

    if (!quiz) {
        notFound();
    }

    const design = (quiz.design as any) || {
        colors: { primary: '#2563eb', background: '#f8fafc', text: '#0f172a', accent: '#3b82f6', gradient: undefined },
    };

    return (
        <div
            className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
            style={{
                backgroundColor: design.colors?.background || '#f8fafc',
                backgroundImage: design.colors?.gradient,
            }}
        >
            <div className="max-w-3xl mx-auto text-center mb-12">
                <h1
                    className="text-3xl font-extrabold sm:text-4xl mb-4"
                    style={{ color: design.colors?.text || '#0f172a' }}
                >
                    {quiz.title}
                </h1>
                <p
                    className="text-lg opacity-80"
                    style={{ color: design.colors?.text || '#0f172a' }}
                >
                    {quiz.description || ''}
                </p>
            </div>

            <QuizEngine quiz={quiz as any} />
        </div>
    );
}
