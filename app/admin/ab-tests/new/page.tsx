import { getQuizzes } from '@/app/actions/quiz';
import AbTestEditor from '@/components/admin/AbTestEditor';

export const dynamic = 'force-dynamic';

export default async function NewAbTestPage() {
    const quizzes = await getQuizzes();

    return (
        <AbTestEditor quizzes={quizzes} />
    );
}
