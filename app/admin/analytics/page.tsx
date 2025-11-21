import { BarChart3, TrendingUp, Users, MousePointerClick } from 'lucide-react';

const analyticsStats = [
    { label: 'Total Views', value: '12,450', change: '+12%', icon: Users, color: 'text-blue-600' },
    { label: 'Completion Rate', value: '45.2%', change: '+5%', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Leads Captured', value: '5,630', change: '+18%', icon: MousePointerClick, color: 'text-purple-600' },
    { label: 'Avg. Time', value: '2m 15s', change: '-2%', icon: BarChart3, color: 'text-orange-600' },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {analyticsStats.map((stat) => (
                    <div key={stat.label} className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                                {stat.change}
                            </span>
                            <span className="text-gray-500 ml-2">vs last month</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section (Placeholder) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Acquisition Trend</h3>
                    <div className="h-64 flex items-end justify-between space-x-2">
                        {[40, 60, 45, 70, 50, 80, 65].map((height, i) => (
                            <div
                                key={i}
                                className="w-full bg-blue-100 rounded-t-md hover:bg-blue-200 transition-colors relative group"
                                style={{ height: `${height}%` }}
                            >
                                <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-md" style={{ height: '40%' }}></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Quizzes</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Marketing Strategy Quiz', leads: 2450, rate: '48%' },
                            { name: 'Product Fit Quiz', leads: 1230, rate: '35%' },
                            { name: 'Personality Test', leads: 890, rate: '62%' },
                        ].map((quiz, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">{quiz.name}</p>
                                    <p className="text-sm text-gray-500">{quiz.leads} leads</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">{quiz.rate}</p>
                                    <p className="text-sm text-gray-500">Conv. Rate</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
