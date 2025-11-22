import { getQuiz } from '@/app/actions/quiz';
import { getIntegrations } from '@/app/actions/integration';
import IntegrationsManager from '@/components/admin/IntegrationsManager';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function QuizIntegrationsPage({ params }: PageProps) {
    const { id } = await params;
    const quiz = await getQuiz(id);

    if (!quiz) {
        notFound();
    }

    const integrations = await getIntegrations(id);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/quizzes"
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Integrations: {quiz.title}</h1>
                        <p className="text-slate-500">Connect third-party tools</p>
                    </div>
                </div>
            </div>

            <IntegrationsManager quizId={id} initialIntegrations={integrations} />
        </div>
    );
}
