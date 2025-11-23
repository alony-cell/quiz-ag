'use client';

import { useState } from 'react';
import { Question, DesignConfig } from '@/types';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import QuestionEditor from './QuestionEditor';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionListProps {
    questions: Question[];
    design: DesignConfig;
    onUpdate: (questions: Question[]) => void;
}

export default function QuestionList({ questions, design, onUpdate }: QuestionListProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const handleSaveQuestion = (updatedQuestion: Question) => {
        if (isCreating) {
            const newQuestion = { ...updatedQuestion, id: `q-${Date.now()}`, order: questions.length + 1 };
            onUpdate([...questions, newQuestion]);
            setIsCreating(false);
        } else {
            const updatedQuestions = questions.map((q) =>
                q.id === updatedQuestion.id ? updatedQuestion : q
            );
            onUpdate(updatedQuestions);
            setEditingId(null);
        }
    };

    const handleDeleteQuestion = (id: string) => {
        if (confirm('Are you sure you want to delete this question?')) {
            onUpdate(questions.filter((q) => q.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 font-heading">Questions</h3>
                {!isCreating && !editingId && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                    </button>
                )}
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {questions.map((question, index) => (
                        <motion.div
                            key={question.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
                        >
                            {editingId === question.id ? (
                                <QuestionEditor
                                    initialQuestion={question}
                                    design={design}
                                    allQuestions={questions}
                                    onSave={handleSaveQuestion}
                                    onCancel={() => setEditingId(null)}
                                />
                            ) : (
                                <div className="p-4 flex items-center gap-4">
                                    <div className="cursor-move text-slate-400 hover:text-slate-600">
                                        <GripVertical className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded">
                                                {index + 1}
                                            </span>
                                            <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600 rounded uppercase">
                                                {question.type.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="font-medium text-slate-900 mt-1">{question.text}</p>
                                        {question.type === 'multiple_choice' && (
                                            <p className="text-sm text-slate-500 mt-1">
                                                {question.options?.length || 0} options
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setEditingId(question.id)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteQuestion(question.id)}
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
                    >
                        <QuestionEditor
                            design={design}
                            allQuestions={questions}
                            onSave={handleSaveQuestion}
                            onCancel={() => setIsCreating(false)}
                        />
                    </motion.div>
                )}

                {questions.length === 0 && !isCreating && (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-500">No questions yet. Add one to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
