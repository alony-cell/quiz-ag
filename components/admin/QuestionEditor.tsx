'use client';

import { useState, useEffect } from 'react';
import { Question, AnswerOption, DesignConfig, QuestionElement } from '@/types';
import { Plus, Trash2, GripVertical, Check, Circle, Square, Star, Info, ShoppingCart, TrendingUp, Mail, ThumbsUp, Save, ArrowRight, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTION_TYPES = [
    { id: 'multiple_choice', label: 'Multiple Choice', icon: Check },
    { id: 'single_choice', label: 'Single Choice', icon: Circle },
    { id: 'true_false', label: 'True/False', icon: Check },
    { id: 'text', label: 'Open Ended', icon: Mail },
    { id: 'scale', label: 'Short Answer', icon: TrendingUp }, // Mapping scale to short answer for now based on UI
    { id: 'multi_select', label: 'Matching', icon: Square }, // Placeholder mapping
];

interface QuestionEditorProps {
    initialQuestion?: Partial<Question>;
    design?: DesignConfig;
    allQuestions?: Question[];
    onSave: (question: Question) => void;
    onCancel: () => void;
}

export default function QuestionEditor({ initialQuestion, design, allQuestions = [], onSave, onCancel }: QuestionEditorProps) {
    const [question, setQuestion] = useState<Partial<Question>>({
        text: '',
        type: 'multiple_choice',
        options: [
            { value: 'option-1', label: '' },
            { value: 'option-2', label: '' },
        ],
        isActive: true,
        isRequired: true,
        allowBack: false,
        ...initialQuestion,
    });

    // Update local state when initialQuestion changes (e.g. switching questions)
    useEffect(() => {
        if (initialQuestion) {
            setQuestion({
                ...initialQuestion,
                options: initialQuestion.options || [
                    { value: 'option-1', label: '' },
                    { value: 'option-2', label: '' },
                ]
            });
        }
    }, [initialQuestion]);

    const handleAddOption = () => {
        const newOption: AnswerOption = {
            value: `option-${Date.now()}`,
            label: '',
        };
        setQuestion({
            ...question,
            options: [...(question.options || []), newOption],
        });
    };

    const handleRemoveOption = (index: number) => {
        const newOptions = [...(question.options || [])];
        newOptions.splice(index, 1);
        setQuestion({ ...question, options: newOptions });
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...(question.options || [])];
        newOptions[index].label = value;
        setQuestion({ ...question, options: newOptions });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.text) return;
        onSave(question as Question);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header / Title Area */}
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="font-medium text-slate-900">Question {question.order || 1}</span>
                    </div>
                    <div className="relative group">
                        <select
                            value={question.type}
                            onChange={(e) => {
                                let newOptions = question.options;
                                const newType = e.target.value as any;
                                if (newType === 'true_false') {
                                    newOptions = [
                                        { value: 'true', label: 'True', score: 1 },
                                        { value: 'false', label: 'False', score: 0 },
                                    ];
                                } else if (['rating', 'content', 'testimonial', 'product', 'scale'].includes(newType)) {
                                    newOptions = [];
                                } else if (!question.options || question.options.length === 0) {
                                    newOptions = [
                                        { value: 'option-1', label: '' },
                                        { value: 'option-2', label: '' },
                                    ];
                                }
                                setQuestion({ ...question, type: newType, options: newOptions });
                            }}
                            className="appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                        >
                            {QUESTION_TYPES.map(type => (
                                <option key={type.id} value={type.id}>{type.label}</option>
                            ))}
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
                <input
                    type="text"
                    value={question.text || ''}
                    onChange={(e) => setQuestion({ ...question, text: e.target.value })}
                    className="w-full text-xl font-semibold text-slate-900 placeholder-slate-300 border-none p-0 focus:ring-0 bg-transparent"
                    placeholder="What does Tech 2.0 quiz builder offer?"
                />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Description */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                        Description <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <textarea
                        value={question.description || ''}
                        onChange={(e) => setQuestion({ ...question, description: e.target.value })}
                        className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-4 min-h-[80px] resize-none bg-slate-50/50 focus:bg-white transition-colors"
                        placeholder="Add extra context or instructions..."
                    />
                </div>

                {/* Options / Answers */}
                {(question.type === 'multiple_choice' || question.type === 'single_choice' || question.type === 'multi_select') && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-slate-700">
                                Answer Options
                            </label>
                        </div>
                        <div className="space-y-3">
                            {question.options?.map((option, index) => (
                                <div key={index} className="bg-white border border-slate-200 rounded-xl p-1 transition-all hover:border-slate-300 hover:shadow-sm">
                                    <div className="flex items-center gap-3 p-2">
                                        <div className="flex-shrink-0 text-slate-300 pl-2">
                                            {question.type === 'multiple_choice' || question.type === 'multi_select' ? (
                                                <Square className="w-5 h-5 rounded" />
                                            ) : (
                                                <Circle className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={option.label}
                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                                className="block w-full border-none p-0 text-sm focus:ring-0 placeholder-slate-300 font-medium text-slate-900"
                                                placeholder={`Option ${index + 1}`}
                                            />
                                        </div>
                                        <div className="flex items-center gap-1 pr-1">
                                            <button
                                                onClick={() => {
                                                    const newOptions = [...(question.options || [])];
                                                    // Toggle expanded state for this option (we'll need a local state or just inline it)
                                                    // For now, let's just show the fields below if we want "Advanced" always visible or toggleable
                                                    // Let's add a simple toggle for "Edit Details"
                                                    const isExpanded = (option as any)._expanded;
                                                    newOptions[index] = { ...option, _expanded: !isExpanded } as any;
                                                    setQuestion({ ...question, options: newOptions });
                                                }}
                                                className={`p-2 rounded-lg transition-colors ${(option as any)._expanded ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                                    }`}
                                                title="Edit Details"
                                            >
                                                <Settings className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleRemoveOption(index)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    <AnimatePresence>
                                        {(option as any)._expanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-3 pt-0 border-t border-slate-100 mt-2 grid grid-cols-2 gap-4 bg-slate-50/50 rounded-b-xl">
                                                    <div>
                                                        <label className="block text-xs font-medium text-slate-500 mb-1">Value (Data)</label>
                                                        <input
                                                            type="text"
                                                            value={option.value}
                                                            onChange={(e) => {
                                                                const newOptions = [...(question.options || [])];
                                                                newOptions[index] = { ...option, value: e.target.value };
                                                                setQuestion({ ...question, options: newOptions });
                                                            }}
                                                            className="block w-full rounded-lg border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs p-2"
                                                            placeholder="value_for_db"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-slate-500 mb-1">Score</label>
                                                        <input
                                                            type="number"
                                                            value={option.score || 0}
                                                            onChange={(e) => {
                                                                const newOptions = [...(question.options || [])];
                                                                newOptions[index] = { ...option, score: parseInt(e.target.value) || 0 };
                                                                setQuestion({ ...question, options: newOptions });
                                                            }}
                                                            className="block w-full rounded-lg border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs p-2"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleAddOption}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors w-full justify-center border border-blue-100 border-dashed"
                        >
                            <Plus className="w-4 h-4" />
                            Add Option
                        </button>
                    </div>
                )}

                {/* True/False Specifics */}
                {question.type === 'true_false' && (
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-500">
                            True/False Labels
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={question.options?.[0]?.label || 'True'}
                                onChange={(e) => {
                                    const newOptions = [
                                        { value: 'true', label: e.target.value },
                                        question.options?.[1] || { value: 'false', label: 'False' }
                                    ];
                                    setQuestion({ ...question, options: newOptions });
                                }}
                                className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-3"
                            />
                            <input
                                type="text"
                                value={question.options?.[1]?.label || 'False'}
                                onChange={(e) => {
                                    const newOptions = [
                                        question.options?.[0] || { value: 'true', label: 'True' },
                                        { value: 'false', label: e.target.value }
                                    ];
                                    setQuestion({ ...question, options: newOptions });
                                }}
                                className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-3"
                            />
                        </div>
                    </div>
                )}

                {/* Settings / Toggles */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                    <h4 className="text-sm font-medium text-slate-900">Settings</h4>
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={question.isRequired !== false}
                                onChange={(e) => setQuestion({ ...question, isRequired: e.target.checked })}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                            />
                            <span className="text-sm text-slate-600">Required</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={!!question.allowBack}
                                onChange={(e) => setQuestion({ ...question, allowBack: e.target.checked })}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                            />
                            <span className="text-sm text-slate-600">Allow Back</span>
                        </label>
                    </div>
                </div>

                {/* Logic Builder */}
                {(question.type === 'multiple_choice' || question.type === 'single_choice' || question.type === 'true_false') && (
                    <div className="pt-6 border-t border-slate-100 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-slate-900">Logic & Branching</h4>
                            <button
                                onClick={() => {
                                    const newRule = {
                                        condition: 'is' as const,
                                        value: question.options?.[0]?.value || '',
                                        action: 'jump_to' as const,
                                        target: allQuestions.find(q => q.id !== question.id)?.id || ''
                                    };
                                    setQuestion({ ...question, logic: [...(question.logic || []), newRule] });
                                }}
                                className="text-xs font-medium text-blue-600 hover:text-blue-700"
                            >
                                + Add Rule
                            </button>
                        </div>

                        <div className="space-y-3">
                            {(question.logic || []).map((rule, index) => (
                                <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                                    <span className="text-slate-500">If answer</span>
                                    <select
                                        value={rule.condition}
                                        onChange={(e) => {
                                            const newLogic = [...(question.logic || [])];
                                            newLogic[index] = { ...rule, condition: e.target.value as 'is' | 'isnt' };
                                            setQuestion({ ...question, logic: newLogic });
                                        }}
                                        className="bg-white border-slate-200 rounded text-xs py-1 pl-2 pr-6"
                                    >
                                        <option value="is">is</option>
                                        <option value="isnt">isn't</option>
                                    </select>
                                    <select
                                        value={rule.value}
                                        onChange={(e) => {
                                            const newLogic = [...(question.logic || [])];
                                            newLogic[index] = { ...rule, value: e.target.value };
                                            setQuestion({ ...question, logic: newLogic });
                                        }}
                                        className="bg-white border-slate-200 rounded text-xs py-1 pl-2 pr-6 max-w-[120px]"
                                    >
                                        <option value="">Select...</option>
                                        {question.options?.map((opt, i) => (
                                            <option key={i} value={opt.value}>{opt.label || opt.value}</option>
                                        ))}
                                    </select>
                                    <span className="text-slate-500">go to</span>
                                    <select
                                        value={rule.target}
                                        onChange={(e) => {
                                            const newLogic = [...(question.logic || [])];
                                            newLogic[index] = { ...rule, target: e.target.value };
                                            setQuestion({ ...question, logic: newLogic });
                                        }}
                                        className="bg-white border-slate-200 rounded text-xs py-1 pl-2 pr-6 flex-1"
                                    >
                                        <option value="">Select question...</option>
                                        {allQuestions
                                            .filter(q => q.id !== question.id)
                                            .map(q => (
                                                <option key={q.id} value={q.id}>
                                                    {q.order}. {q.text || 'Untitled'}
                                                </option>
                                            ))}
                                    </select>
                                    <button
                                        onClick={() => {
                                            const newLogic = (question.logic || []).filter((_, i) => i !== index);
                                            setQuestion({ ...question, logic: newLogic });
                                        }}
                                        className="text-slate-400 hover:text-red-500"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {(!question.logic || question.logic.length === 0) && (
                                <div className="text-center py-4 border border-dashed border-slate-200 rounded-lg">
                                    <p className="text-xs text-slate-400">No logic rules defined.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
                <button
                    onClick={onCancel} // Or save as draft logic
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm transition-all"
                >
                    <Save className="w-4 h-4" />
                    Save as Draft
                </button>
                <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md shadow-blue-200 transition-all"
                >
                    Save & Next
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
