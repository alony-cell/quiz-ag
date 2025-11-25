import Link from 'next/link';
import { Plus, Users, FileText, TrendingUp, ArrowUpRight } from 'lucide-react';
import { getQuizzes } from '@/app/actions/quiz';
import { getGlobalStats } from '@/app/actions/analytics';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const quizzes = await getQuizzes();
    const stats = await getGlobalStats();

    const dashboardStats = [
        {
            label: 'Total Quizzes',
            value: stats.totalQuizzes.toString(),
            icon: FileText,
            gradient: 'from-blue-500 to-blue-600',
            shadow: 'shadow-blue-200',
            trend: 'All time'
        },
        {
            label: 'Total Leads',
            value: stats.totalLeads.toString(),
            icon: Users,
            gradient: 'from-violet-500 to-purple-600',
            shadow: 'shadow-purple-200',
            trend: 'All time'
        },
        {
            label: 'Total Responses',
            value: stats.totalResponses.toString(),
            icon: TrendingUp,
            gradient: 'from-emerald-500 to-teal-600',
            shadow: 'shadow-emerald-200',
            trend: 'All time'
        },
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
                    className="flex items-center px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm font-medium"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Quiz
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {dashboardStats.map((stat) => (
                    <div key={stat.label} className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} p-6 rounded-2xl shadow-lg ${stat.shadow} text-white transition-transform hover:-translate-y-1`}>
                        <div className="relative z-10 flex items-start justify-between">
                            <div>
                                <p className="text-blue-100 font-medium text-sm">{stat.label}</p>
                                <p className="text-4xl font-bold mt-2 font-heading">{stat.value}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="relative z-10 mt-6 flex items-center text-sm text-blue-100">
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                            <span className="font-medium mr-2">Trending</span>
                            {stat.trend}
                        </div>

                        {/* Decorative background circles */}
                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-black/5 rounded-full blur-2xl"></div>
                    </div>
                ))}
            </div>

            {/* Recent Quizzes */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-900 font-heading">Recent Quizzes</h3>
                    <Link href="/admin/quizzes" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center group">
                        View All
                        <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </div>
                <div className="divide-y divide-slate-100">
                    {quizzes.slice(0, 5).map((quiz) => (
                        <div key={quiz.id} className="flex items-center justify-between px-8 py-5 hover:bg-slate-50/80 transition-colors group">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl text-blue-600 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-blue-100">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{quiz.title}</h4>
                                    <p className="text-sm text-slate-500">
                                        {new Date(quiz.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6">
                                <span
                                    className={`px-3 py-1 text-xs font-medium rounded-full border ${quiz.isActive
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
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
                        <div className="p-12 text-center text-slate-500">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-lg font-medium text-slate-900">No quizzes found</p>
                            <p className="text-sm text-slate-500 mt-1">Create your first quiz to get started!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
