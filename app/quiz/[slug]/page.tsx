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

    return <QuizEngine quiz={quiz as any} />;
}
