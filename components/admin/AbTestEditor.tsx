'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveAbTest } from '@/app/actions/ab-test';
import { Loader2, Plus, Trash2, AlertCircle } from 'lucide-react';

interface AbTestEditorProps {
    initialTest?: any;
    quizzes: any[];
}

export default function AbTestEditor({ initialTest, quizzes }: AbTestEditorProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [test, setTest] = useState({
        id: initialTest?.id,
        name: initialTest?.name || '',
        slug: initialTest?.slug || '',
        status: initialTest?.status || 'draft',
        variants: initialTest?.variants || [{ quizId: '', trafficPercentage: 50 }, { quizId: '', trafficPercentage: 50 }],
    });

    const handleSave = async () => {
        setError('');

        // Validation
        if (!test.name || !test.slug) {
            setError('Name and Slug are required');
            return;
        }

        const totalPercentage = test.variants.reduce((sum: number, v: any) => sum + (parseInt(v.trafficPercentage) || 0), 0);
        if (totalPercentage !== 100) {
            setError(`Total traffic percentage must be 100%. Current: ${totalPercentage}%`);
            return;
        }

        if (test.variants.some((v: any) => !v.quizId)) {
            setError('All variants must have a selected quiz');
            return;
        }

        setIsSaving(true);
        const result = await saveAbTest(test);
        setIsSaving(false);

        if (result.success) {
            router.push('/admin/ab-tests');
            router.refresh();
        } else {
            setError(result.error || 'Failed to save test');
        }
    };

    const addVariant = () => {
        setTest({
            ...test,
            variants: [...test.variants, { quizId: '', trafficPercentage: 0 }]
        });
    };

    const removeVariant = (index: number) => {
        const newVariants = [...test.variants];
        newVariants.splice(index, 1);
        setTest({ ...test, variants: newVariants });
    };

    const updateVariant = (index: number, field: string, value: any) => {
        const newVariants = [...test.variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setTest({ ...test, variants: newVariants });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">
                    {initialTest ? 'Edit A/B Test' : 'Create New A/B Test'}
                </h1>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save Test
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-semibold text-slate-900">Test Settings</h2>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Test Name</label>
                            <input
                                type="text"
                                value={test.name}
                                onChange={(e) => setTest({ ...test, name: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Homepage Quiz Variation"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug</label>
                            <div className="flex items-center">
                                <span className="text-slate-500 mr-2">/ab/</span>
                                <input
                                    type="text"
                                    value={test.slug}
                                    onChange={(e) => setTest({ ...test, slug: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="homepage-test"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select
                                value={test.status}
                                onChange={(e) => setTest({ ...test, status: e.target.value as any })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                                <option value="stopped">Stopped</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">Variants</h2>
                            <button
                                onClick={addVariant}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Variant
                            </button>
                        </div>

                        <div className="space-y-4">
                            {test.variants.map((variant: any, index: number) => (
                                <div key={index} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 mb-1">Quiz Variant</label>
                                            <select
                                                value={variant.quizId}
                                                onChange={(e) => updateVariant(index, 'quizId', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select a quiz...</option>
                                                {quizzes.map(q => (
                                                    <option key={q.id} value={q.id}>{q.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 mb-1">Traffic Share (%)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={variant.trafficPercentage}
                                                onChange={(e) => updateVariant(index, 'trafficPercentage', parseInt(e.target.value))}
                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeVariant(index)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-6"
                                        title="Remove Variant"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-100">
                            <span className="text-slate-500">Total Traffic Allocation:</span>
                            <span className={`font-bold ${test.variants.reduce((sum: number, v: any) => sum + (v.trafficPercentage || 0), 0) === 100
                                    ? 'text-emerald-600'
                                    : 'text-red-600'
                                }`}>
                                {test.variants.reduce((sum: number, v: any) => sum + (v.trafficPercentage || 0), 0)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Info */}
                <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
                        <p className="text-sm text-blue-700 leading-relaxed">
                            A/B testing allows you to split traffic between different versions of your quiz to see which performs better.
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-blue-700 list-disc list-inside">
                            <li>Create multiple quizzes (variants)</li>
                            <li>Assign traffic percentage to each</li>
                            <li>Ensure total equals 100%</li>
                            <li>Use the Test URL to distribute traffic</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
