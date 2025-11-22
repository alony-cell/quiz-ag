import { getQuiz } from '@/app/actions/quiz';
import { getFunnelData, getScoreDistribution, getQuizStats } from '@/app/actions/analytics';
import FunnelChart from '@/components/analytics/FunnelChart';
import ScoreChart from '@/components/analytics/ScoreChart';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function QuizAnalyticsPage({ params }: PageProps) {
    const { id } = await params;
    const quiz = await getQuiz(id);

    if (!quiz) {
        notFound();
    }

    const [funnelData, scoreData, stats] = await Promise.all([
        getFunnelData(id),
        getScoreDistribution(id),
        getQuizStats(id),
    ]);

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                    <Link
                        href="/admin/quizzes"
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Analytics: {quiz.title}</h1>
                        <p className="text-sm sm:text-base text-slate-500">Performance overview</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Total Responses</p>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{stats.totalResponses}</p>
                </div>
                <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Avg. Time Taken</p>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{stats.avgTimeTaken}s</p>
                </div>
                <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-xl shadow-sm sm:col-span-2 lg:col-span-1">
                    <p className="text-sm font-medium text-slate-500">Completion Rate</p>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                        {stats.totalResponses > 0
                            ? Math.round((stats.totalResponses / (funnelData.find(s => s.step === 'start')?.count || 1)) * 100)
                            : 0}%
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Funnel Analysis */}
                <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 sm:mb-6">Conversion Funnel</h2>
                    <FunnelChart data={funnelData} />
                </div>

                {/* Score Distribution */}
                <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 sm:mb-6">Score Distribution</h2>
                    <ScoreChart data={scoreData} />
                </div>
            </div>
        </div>
    );
}
