import Link from 'next/link';
import { Plus, Users, FileText, TrendingUp, ArrowUpRight } from 'lucide-react';
import { getQuizzes } from '@/app/actions/quiz';
import { getGlobalStats } from '@/app/actions/analytics';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const quizzes = await getQuizzes();
    const stats = await getGlobalStats();

    const dashboardStats = [
        { label: 'Total Quizzes', value: stats.totalQuizzes.toString(), icon: FileText, color: 'bg-blue-500', trend: 'All time' },
        { label: 'Total Leads', value: stats.totalLeads.toString(), icon: Users, color: 'bg-indigo-500', trend: 'All time' },
        { label: 'Total Responses', value: stats.totalResponses.toString(), icon: TrendingUp, color: 'bg-emerald-500', trend: 'All time' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold font-heading text-slate-900">Dashboard</h2>
                    <p className="text-slate-500 mt-1">Welcome back, here's what's happening.</p>
                </div>
                <Link
                    href="/admin/quizzes/new"
                    className="flex items-center px-5 py-2.5 text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Quiz
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {dashboardStats.map((stat) => (
                    <div key={stat.label} className="glass-card p-6 rounded-2xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2 font-heading">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-slate-400">
                            <ArrowUpRight className="w-4 h-4 mr-1 text-emerald-500" />
                            <span className="text-emerald-600 font-medium mr-2">Trending</span>
                            {stat.trend}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Quizzes */}
            <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900 font-heading">Recent Quizzes</h3>
                    <Link href="/admin/quizzes" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        View All
                    </Link>
                </div>
                <div className="divide-y divide-slate-100">
                    {quizzes.slice(0, 5).map((quiz) => (
                        <div key={quiz.id} className="flex items-center justify-between px-8 py-5 hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">{quiz.title}</h4>
                                    <p className="text-sm text-slate-500">
                                        {new Date(quiz.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6">
                                <span
                                    className={`px-3 py-1 text-xs font-medium rounded-full border ${quiz.isActive
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-slate-100 text-slate-600 border-slate-200'
                                        }`}
                                >
                                    {quiz.isActive ? 'Active' : 'Draft'}
                                </span>
                                <Link
                                    href={`/admin/quizzes/${quiz.id}`}
                                    className="text-sm font-medium text-slate-400 hover:text-blue-600 transition-colors"
                                >
                                    Manage
                                </Link>
                            </div>
                        </div>
                    ))}
                    {quizzes.length === 0 && (
                        <div className="p-8 text-center text-slate-500">
                            No quizzes found. Create one to get started!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
