import { getAllLeads } from '@/app/actions/analytics';
import LeadsTable from '@/components/admin/LeadsTable';

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

            <LeadsTable leads={leads} />
        </div>
    );
}
