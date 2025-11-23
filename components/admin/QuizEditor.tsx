'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { Quiz, Question } from '@/types';
import { saveQuiz } from '@/app/actions/quiz';
interface QuizEditorProps {
    initialData?: Partial<Quiz>;
    isNew?: boolean;
}

export default function QuizEditor({ initialData, isNew = false }: QuizEditorProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<Partial<Quiz>>({
        title: '',
        slug: '',
        description: '',
        isActive: false,
        ...initialData,
        // ensure questions are not duplicated in formData
        questions: undefined,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const result = await saveQuiz({
                ...formData,
                questions: initialData?.questions || [], // Pass existing questions to prevent deletion
            });
            if (result.success && result.quizId) {
                router.push(`/admin/quizzes/${result.quizId}`);
            }
        } catch (error) {
            console.error('Failed to save quiz:', error);
            alert('Failed to save quiz. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Link href="/admin/dashboard" className="mr-4 text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isNew ? 'Create New Quiz' : 'Edit Quiz'}
                    </h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                    {isSaving ? 'Saving...' : 'Save Quiz'}
                </button>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Quiz Title</label>
                        <input
                            type="text"
                            value={formData.title || ''}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="e.g., Marketing Strategy Quiz"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL Slug</label>
                        <div className="flex mt-1 rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 text-gray-500 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md sm:text-sm">/quiz/</span>
                            <input
                                type="text"
                                value={formData.slug || ''}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                className="flex-1 block w-full min-w-0 border-gray-300 rounded-none focus:border-blue-500 focus:ring-blue-500 rounded-r-md sm:text-sm"
                                placeholder="marketing-strategy"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={formData.description || ''}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Briefly describe what this quiz is about..."
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            id="isActive"
                            type="checkbox"
                            checked={formData.isActive || false}
                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Active (visible to public)</label>
                    </div>
                </form>
            </div>
        </div>
    );
}
