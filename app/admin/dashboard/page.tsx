import Link from 'next/link';
import { Plus, Users, FileText, TrendingUp, ArrowUpRight } from 'lucide-react';

// Mock Data (Temporary)
const stats = [
    { label: 'Total Quizzes', value: '12', icon: FileText, color: 'bg-blue-500', trend: '+2 this week' },
    { label: 'Total Leads', value: '1,234', icon: Users, color: 'bg-indigo-500', trend: '+12% vs last month' },
    { label: 'Active Quizzes', value: '8', icon: TrendingUp, color: 'bg-emerald-500', trend: 'Stable' },
];

const recentQuizzes = [
    { id: '1', title: 'Marketing Strategy Quiz', leads: 450, status: 'Active', date: '2 days ago' },
    { id: '2', title: 'Product Fit Quiz', leads: 120, status: 'Draft', date: '5 days ago' },
    { id: '3', title: 'Personality Test', leads: 890, status: 'Active', date: '1 week ago' },
];

export default function DashboardPage() {
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
                {stats.map((stat) => (
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
                    {recentQuizzes.map((quiz) => (
                        <div key={quiz.id} className="flex items-center justify-between px-8 py-5 hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">{quiz.title}</h4>
                                    <p className="text-sm text-slate-500">{quiz.leads} leads captured • {quiz.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6">
                                <span
                                    className={`px-3 py-1 text-xs font-medium rounded-full border ${quiz.status === 'Active'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-slate-100 text-slate-600 border-slate-200'
                                        }`}
                                >
                                    {quiz.status}
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
                </div>
            </div>
        </div>
    );
}
