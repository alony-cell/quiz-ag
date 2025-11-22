import { getQuiz } from '@/app/actions/quiz';
import QuizManager from '@/components/admin/QuizManager';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditQuizPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const quiz = await getQuiz(id);

    if (!quiz) {
        notFound();
    }

    return <QuizManager initialQuiz={quiz as any} />;
}
