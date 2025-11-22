'use client';

import { useState } from 'react';
import { ThankYouPage } from '@/types';
import { Plus, Edit2, Trash2, GripVertical, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThankYouEditorProps {
    thankYouPages: ThankYouPage[];
    onUpdate: (pages: ThankYouPage[]) => void;
}

export default function ThankYouEditor({ thankYouPages, onUpdate }: ThankYouEditorProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [editForm, setEditForm] = useState<Partial<ThankYouPage>>({});

    const handleStartEdit = (page: ThankYouPage) => {
        setEditingId(page.id);
        setEditForm(page);
        setIsCreating(false);
    };

    const handleStartCreate = () => {
        setIsCreating(true);
        setEditingId('new');
        setEditForm({
            title: 'Thank You!',
            content: 'Thanks for completing the quiz.',
            buttonText: 'Continue',
            scoreRangeMin: 0,
            scoreRangeMax: 100,
        });
    };

    const handleSave = () => {
        if (!editForm.title) return;

        if (isCreating) {
            const newPage: ThankYouPage = {
                id: `typ-${Date.now()}`,
                quizId: '', // Will be set by parent or backend
                title: editForm.title,
                content: editForm.content,
                buttonText: editForm.buttonText,
                buttonUrl: editForm.buttonUrl,
                scoreRangeMin: editForm.scoreRangeMin,
                scoreRangeMax: editForm.scoreRangeMax,
                imageUrl: editForm.imageUrl,
            };
            onUpdate([...thankYouPages, newPage]);
            setIsCreating(false);
        } else {
            const updatedPages = thankYouPages.map((p) =>
                p.id === editingId ? { ...p, ...editForm } as ThankYouPage : p
            );
            onUpdate(updatedPages);
            setEditingId(null);
        }
        setEditForm({});
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this page?')) {
            onUpdate(thankYouPages.filter((p) => p.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 font-heading">Outcome Pages</h3>
                {!isCreating && !editingId && (
                    <button
                        onClick={handleStartCreate}
                        className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Outcome
                    </button>
                )}
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {thankYouPages.map((page, index) => (
                        <motion.div
                            key={page.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
                        >
                            {editingId === page.id ? (
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                            <input
                                                type="text"
                                                value={editForm.title || ''}
                                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                                                placeholder="e.g., You are a Pro!"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                                            <textarea
                                                value={editForm.content || ''}
                                                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                                rows={3}
                                                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                                                placeholder="Description of the outcome..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Min Score</label>
                                                <input
                                                    type="number"
                                                    value={editForm.scoreRangeMin || 0}
                                                    onChange={(e) => setEditForm({ ...editForm, scoreRangeMin: parseInt(e.target.value) || 0 })}
                                                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Max Score</label>
                                                <input
                                                    type="number"
                                                    value={editForm.scoreRangeMax || 0}
                                                    onChange={(e) => setEditForm({ ...editForm, scoreRangeMax: parseInt(e.target.value) || 0 })}
                                                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Button Text</label>
                                                <input
                                                    type="text"
                                                    value={editForm.buttonText || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, buttonText: e.target.value })}
                                                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Button URL</label>
                                                <input
                                                    type="text"
                                                    value={editForm.buttonUrl || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, buttonUrl: e.target.value })}
                                                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                        >
                                            Save Page
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 flex items-center gap-4">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-slate-900">{page.title}</h4>
                                        <p className="text-sm text-slate-500 mt-1 truncate">{page.content}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="px-2 py-0.5 text-xs font-medium bg-green-50 text-green-700 rounded">
                                                Score: {page.scoreRangeMin} - {page.scoreRangeMax}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleStartEdit(page)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(page.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 space-y-6"
                    >
                        <h4 className="font-medium text-slate-900">New Outcome Page</h4>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={editForm.title || ''}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                                    placeholder="e.g., You are a Pro!"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                                <textarea
                                    value={editForm.content || ''}
                                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                    rows={3}
                                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                                    placeholder="Description of the outcome..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Min Score</label>
                                    <input
                                        type="number"
                                        value={editForm.scoreRangeMin || 0}
                                        onChange={(e) => setEditForm({ ...editForm, scoreRangeMin: parseInt(e.target.value) || 0 })}
                                        className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Score</label>
                                    <input
                                        type="number"
                                        value={editForm.scoreRangeMax || 0}
                                        onChange={(e) => setEditForm({ ...editForm, scoreRangeMax: parseInt(e.target.value) || 0 })}
                                        className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Button Text</label>
                                    <input
                                        type="text"
                                        value={editForm.buttonText || ''}
                                        onChange={(e) => setEditForm({ ...editForm, buttonText: e.target.value })}
                                        className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Button URL</label>
                                    <input
                                        type="text"
                                        value={editForm.buttonUrl || ''}
                                        onChange={(e) => setEditForm({ ...editForm, buttonUrl: e.target.value })}
                                        className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                Create Page
                            </button>
                        </div>
                    </motion.div>
                )}

                {thankYouPages.length === 0 && !isCreating && (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-500">No outcome pages yet. Add one to define results!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
