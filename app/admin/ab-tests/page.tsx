import Link from 'next/link';
import { getAbTests, deleteAbTest } from '@/app/actions/ab-test';
import { Plus, Split, Trash2, Edit } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function AbTestsPage() {
    const tests = await getAbTests();

    async function handleDelete(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        if (id) {
            await deleteAbTest(id);
            revalidatePath('/admin/ab-tests');
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold font-heading text-slate-900">A/B Tests</h2>
                    <p className="text-slate-500 mt-1">Optimize your quizzes by testing different variants.</p>
                </div>
                <Link
                    href="/admin/ab-tests/new"
                    className="flex items-center px-5 py-2.5 text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Test
                </Link>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Test Name</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Variants</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Created</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {tests.map((test) => (
                                <tr key={test.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                                <Split className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{test.name}</p>
                                                <p className="text-xs text-slate-500">/{test.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 text-xs font-medium rounded-full border ${test.status === 'active'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : test.status === 'stopped'
                                                    ? 'bg-red-50 text-red-700 border-red-200'
                                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                                }`}
                                        >
                                            {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {test.variants?.length || 0} variants
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(test.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/ab-tests/${test.id}`}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Test"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <form action={handleDelete}>
                                                <input type="hidden" name="id" value={test.id} />
                                                <button
                                                    type="submit"
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Test"
                                                    onClick={(e) => {
                                                        if (!confirm('Are you sure you want to delete this test?')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {tests.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No A/B tests found. Create one to start optimizing!
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
