import { getAllLeads } from '@/app/actions/analytics';
import { Users, Mail, Calendar, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
    const leads = await getAllLeads();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold font-heading text-slate-900">Leads</h2>
                    <p className="text-slate-500 mt-1">View and manage leads captured from your quizzes.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 shadow-sm">
                        Total Leads: {leads.length}
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Name</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Email</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Quiz</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Captured At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {leads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                                <Users className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-slate-900">{lead.name || 'Anonymous'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-slate-600">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            <span>{lead.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <FileText className="w-4 h-4 text-slate-400" />
                                            <span className="text-slate-900">{(lead.quiz as any)?.title || 'Unknown Quiz'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span>{new Date(lead.createdAt).toLocaleString()}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {leads.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        No leads found yet. Share your quizzes to start capturing leads!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
