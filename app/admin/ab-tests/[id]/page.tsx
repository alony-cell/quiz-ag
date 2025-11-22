import { getQuizzes } from '@/app/actions/quiz';
import { getAbTest } from '@/app/actions/ab-test';
import AbTestEditor from '@/components/admin/AbTestEditor';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditAbTestPage({ params }: PageProps) {
    const { id } = await params;
    const [test, quizzes] = await Promise.all([
        getAbTest(id),
        getQuizzes(),
    ]);

    if (!test) {
        notFound();
    }

    return (
        <AbTestEditor initialTest={test} quizzes={quizzes} />
    );
}
