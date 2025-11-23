import Link from 'next/link';
import { getQuizzes, deleteQuiz } from '@/app/actions/quiz';
import { Plus, FileText, MoreVertical, ExternalLink, Edit, BarChart3, Plug } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import DeleteQuizButton from '@/components/admin/DeleteQuizButton';

export const dynamic = 'force-dynamic';

export default async function QuizzesPage() {
    const quizzes = await getQuizzes();

    async function handleDelete(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        if (id) {
            await deleteQuiz(id);
            revalidatePath('/admin/quizzes');
        }
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">Quizzes</h2>
                    <p className="text-sm sm:text-base text-slate-500 mt-1">Manage your quizzes and view their performance.</p>
                </div>
                <Link
                    href="/admin/quizzes/new"
                    className="flex items-center justify-center px-5 py-2.5 text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[44px] text-sm font-medium"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Quiz
                </Link>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {quizzes.map((quiz) => (
                    <div key={quiz.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                        <div className="flex items-start space-x-3 mb-3">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 flex-shrink-0">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-slate-900 truncate">{quiz.title}</h3>
                                <p className="text-xs text-slate-500 line-clamp-2">{quiz.description}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
                            <span
                                className={`px-2 py-1 text-xs font-medium rounded-full border ${quiz.isActive
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                    }`}
                            >
                                {quiz.isActive ? 'Active' : 'Draft'}
                            </span>
                            <span>Created {new Date(quiz.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <Link
                                href={`/admin/quizzes/${quiz.id}`}
                                className="flex items-center justify-center px-3 py-2 text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors min-h-[44px]"
                            >
                                <Edit className="w-4 h-4 mr-1.5" />
                                Edit
                            </Link>
                            <Link
                                href={`/admin/quizzes/${quiz.id}/analytics`}
                                className="flex items-center justify-center px-3 py-2 text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors min-h-[44px]"
                            >
                                <BarChart3 className="w-4 h-4 mr-1.5" />
                                Analytics
                            </Link>

                            <Link
                                href={`/quiz/${quiz.slug}`}
                                target="_blank"
                                className="flex items-center justify-center px-3 py-2 text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors min-h-[44px]"
                            >
                                <ExternalLink className="w-4 h-4 mr-1.5" />
                                View
                            </Link>
                        </div>
                    </div>
                ))}
                {quizzes.length === 0 && (
                    <div className="glass-panel rounded-2xl p-8 text-center text-slate-500">
                        No quizzes found. Create one to get started!
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Quiz Title</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Created</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Last Updated</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {quizzes.map((quiz) => (
                                <tr key={quiz.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{quiz.title}</p>
                                                <p className="text-xs text-slate-500 truncate max-w-[200px]">{quiz.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 text-xs font-medium rounded-full border ${quiz.isActive
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : 'bg-slate-100 text-slate-600 border-slate-200'
                                                }`}
                                        >
                                            {quiz.isActive ? 'Active' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(quiz.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(quiz.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/quiz/${quiz.slug}`}
                                                target="_blank"
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Public Page"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>

                                            <Link
                                                href={`/admin/quizzes/${quiz.id}/analytics`}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Analytics"
                                            >
                                                <BarChart3 className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={`/admin/quizzes/${quiz.id}`}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Quiz"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <DeleteQuizButton quizId={quiz.id} onDelete={handleDelete} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {quizzes.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No quizzes found. Create one to get started!
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
