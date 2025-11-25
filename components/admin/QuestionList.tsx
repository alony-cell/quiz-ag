'use client';

import { useState } from 'react';
import { Question, DesignConfig } from '@/types';
import { Plus, Edit2, Trash2, GripVertical, Copy } from 'lucide-react';
import QuestionEditor from './QuestionEditor';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionListProps {
    quizId: string;
    questions: Question[];
    design: DesignConfig;
    onUpdate: (questions: Question[]) => void;
}

export default function QuestionList({ quizId, questions, design, onUpdate }: QuestionListProps) {
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

    // Select the first question by default if none selected
    if (!selectedQuestionId && questions.length > 0) {
        setSelectedQuestionId(questions[0].id);
    }

    const handleSaveQuestion = (updatedQuestion: Question) => {
        const updatedQuestions = questions.map((q) =>
            q.id === updatedQuestion.id ? updatedQuestion : q
        );
        onUpdate(updatedQuestions);
    };

    const handleAddQuestion = () => {
        const newQuestion: Question = {
            id: `q-${Date.now()}`,
            quizId,
            text: 'New Question',
            type: 'multiple_choice',
            order: questions.length + 1,
            options: [
                { value: 'option-1', label: 'Option 1' },
                { value: 'option-2', label: 'Option 2' },
            ],
            isActive: true,
            isRequired: true,
            structure: [
                { id: 'backButton', visible: true, location: 'card', order: 0 },
                { id: 'image', visible: true, location: 'card', order: 1 },
                { id: 'title', visible: true, location: 'card', order: 2 },
                { id: 'description', visible: true, location: 'card', order: 3 },
                { id: 'answers', visible: true, location: 'card', order: 4 },
                { id: 'button', visible: true, location: 'card', order: 5 }
            ]
        };
        onUpdate([...questions, newQuestion]);
        setSelectedQuestionId(newQuestion.id);
    };

    const handleDeleteQuestion = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this question?')) {
            const newQuestions = questions.filter((q) => q.id !== id);
            onUpdate(newQuestions);
            if (selectedQuestionId === id) {
                setSelectedQuestionId(newQuestions.length > 0 ? newQuestions[0].id : null);
            }
        }
    };

    const handleDuplicateQuestion = (question: Question, e: React.MouseEvent) => {
        e.stopPropagation();
        const newQuestion = {
            ...question,
            id: `q-${Date.now()}`,
            text: `${question.text} (Copy)`,
        };

        const index = questions.findIndex(q => q.id === question.id);
        const newQuestions = [...questions];
        newQuestions.splice(index + 1, 0, newQuestion);

        const reorderedQuestions = newQuestions.map((q, i) => ({ ...q, order: i + 1 }));

        onUpdate(reorderedQuestions);
        setSelectedQuestionId(newQuestion.id);
    };

    const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

    return (
        <div className="flex h-[calc(100vh-200px)] min-h-[600px] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Sidebar - Question List */}
            <div className="w-80 border-r border-slate-200 bg-slate-50 flex flex-col">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
                    <h3 className="font-semibold text-slate-900">Questions</h3>
                    <button
                        onClick={handleAddQuestion}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    <AnimatePresence mode="popLayout">
                        {questions.map((question, index) => (
                            <motion.div
                                key={question.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={() => setSelectedQuestionId(question.id)}
                                className={`group relative p-3 rounded-xl cursor-pointer transition-all border ${selectedQuestionId === question.id
                                    ? 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-100'
                                    : 'bg-transparent border-transparent hover:bg-white hover:border-slate-200'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-0.5 text-slate-400 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                                        <GripVertical className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium text-slate-400 w-4">
                                                {index + 1}
                                            </span>
                                            {/* We can map types to icons here if needed, for now just text/color */}
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${selectedQuestionId === question.id
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-slate-200 text-slate-600'
                                                }`}>
                                                {question.type === 'multiple_choice' ? 'Multiple' :
                                                    question.type === 'single_choice' ? 'Single' :
                                                        question.type === 'true_false' ? 'T/F' :
                                                            question.type.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className={`text-sm font-medium truncate ${selectedQuestionId === question.id ? 'text-slate-900' : 'text-slate-600'
                                            }`}>
                                            {question.text || 'New Question'}
                                        </p>
                                    </div>
                                </div>

                                {/* Hover Actions */}
                                <div className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 ${selectedQuestionId === question.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                    } transition-opacity bg-white/80 backdrop-blur-sm rounded-lg p-1`}>
                                    <button
                                        onClick={(e) => handleDuplicateQuestion(question, e)}
                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                                        title="Duplicate"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteQuestion(question.id, e)}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {questions.length === 0 && (
                        <div className="text-center py-8 px-4">
                            <p className="text-sm text-slate-500 mb-3">No questions yet</p>
                            <button
                                onClick={handleAddQuestion}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                + Add your first question
                            </button>
                        </div>
                    )}

                    <button
                        onClick={handleAddQuestion}
                        className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Question
                    </button>
                </div>
            </div>

            {/* Main Area - Editor */}
            <div className="flex-1 bg-white overflow-y-auto">
                {selectedQuestion ? (
                    <div className="h-full">
                        <QuestionEditor
                            initialQuestion={selectedQuestion}
                            design={design}
                            allQuestions={questions}
                            onSave={handleSaveQuestion}
                            onCancel={() => { }} // No cancel needed in this layout really, auto-save or explicit save
                        />
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Edit2 className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-lg font-medium text-slate-900">Select a question to edit</p>
                        <p className="text-sm">or add a new one from the sidebar</p>
                    </div>
                )}
            </div>
        </div>
    );
}
