'use client';

import { useState, useEffect } from 'react';
import { Question, AnswerOption, DesignConfig, QuestionElement } from '@/types';
import { Plus, Trash2, GripVertical, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionCard from '@/components/quiz/QuestionCard';

const defaultQuestionStructure: QuestionElement[] = [
    { id: 'backButton', visible: true, location: 'card', order: 0 },
    { id: 'image', visible: true, location: 'card', order: 1 },
    { id: 'title', visible: true, location: 'card', order: 2 },
    { id: 'description', visible: true, location: 'card', order: 3 },
    { id: 'answers', visible: true, location: 'card', order: 4 },
    { id: 'button', visible: true, location: 'card', order: 5 }
];

const normalizeStructureOrders = (structure: QuestionElement[]): QuestionElement[] => {
    // Sort by location group first, then by order
    const locOrder = { outsideTop: 0, card: 1, outsideBottom: 2 };
    return [...structure].sort((a, b) => {
        if (locOrder[a.location] !== locOrder[b.location]) {
            return locOrder[a.location] - locOrder[b.location];
        }
        return a.order - b.order;
    });
};

interface QuestionEditorProps {
    initialQuestion?: Partial<Question>;
    design?: DesignConfig;
    onSave: (question: Question) => void;
    onCancel: () => void;
}

export default function QuestionEditor({ initialQuestion, design, onSave, onCancel }: QuestionEditorProps) {
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
        structure: [
            { id: 'backButton', visible: true, location: 'card', order: 0 },
            { id: 'image', visible: true, location: 'card', order: 1 },
            { id: 'title', visible: true, location: 'card', order: 2 },
            { id: 'description', visible: true, location: 'card', order: 3 },
            { id: 'answers', visible: true, location: 'card', order: 4 },
            { id: 'button', visible: true, location: 'card', order: 5 }
        ],
        ...initialQuestion,
    });

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
        // Basic validation
        if (!question.text) return;

        onSave(question as Question);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor Column */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 font-heading">
                    {initialQuestion ? 'Edit Question' : 'New Question'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Question Text
                        </label>
                        <input
                            type="text"
                            value={question.text}
                            onChange={(e) => setQuestion({ ...question, text: e.target.value })}
                            className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                            placeholder="e.g., What is your biggest challenge?"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Question Type
                        </label>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {[
                                { id: 'multiple_choice', label: 'Multiple Choice' },
                                { id: 'single_choice', label: 'Single Choice' },
                                { id: 'multi_select', label: 'Multi-Select' },
                                { id: 'true_false', label: 'True / False' },
                                { id: 'yes_no', label: 'Yes / No' },
                                { id: 'rating', label: 'Rating (1-5)' },
                                { id: 'scale', label: 'Scale (1-10)' },
                                { id: 'text', label: 'Text Input' },
                                { id: 'content', label: 'Content Card' },
                                { id: 'testimonial', label: 'Testimonial' },
                                { id: 'product', label: 'Product' },
                            ].map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => {
                                        let newOptions = question.options;
                                        if (type.id === 'true_false') {
                                            newOptions = [
                                                { value: 'true', label: 'True', score: 1 },
                                                { value: 'false', label: 'False', score: 0 },
                                            ];
                                        } else if (type.id === 'yes_no') {
                                            newOptions = [
                                                { value: 'yes', label: 'Yes', score: 1 },
                                                { value: 'no', label: 'No', score: 0 },
                                            ];
                                        } else if (['rating', 'content', 'testimonial', 'product', 'scale'].includes(type.id)) {
                                            newOptions = [];
                                        }
                                        setQuestion({ ...question, type: type.id as any, options: newOptions });
                                    }}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${question.type === type.id
                                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Description (Optional)
                            </label>
                            <textarea
                                value={question.description || ''}
                                onChange={(e) => setQuestion({ ...question, description: e.target.value })}
                                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                                placeholder="Add extra context or details..."
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Image URL (Optional)
                            </label>
                            <input
                                type="text"
                                value={question.imageUrl || ''}
                                onChange={(e) => setQuestion({ ...question, imageUrl: e.target.value })}
                                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Button Text (Optional)
                            </label>
                            <input
                                type="text"
                                value={question.buttonText || ''}
                                onChange={(e) => setQuestion({ ...question, buttonText: e.target.value })}
                                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                                placeholder={question.type === 'text' ? 'Next' : 'Continue'}
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                {question.type === 'multiple_choice' || question.type === 'true_false' || question.type === 'rating'
                                    ? "Setting text here disables auto-advance."
                                    : "Customize the submit button label."}
                            </p>
                        </div>

                        <div className="flex items-center space-x-6 pt-2">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={question.isRequired !== false} // Default to true
                                    onChange={(e) => setQuestion({ ...question, isRequired: e.target.checked })}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                />
                                <span className="text-sm text-slate-700 font-medium">Required</span>
                            </label>

                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={!!question.allowBack}
                                    onChange={(e) => setQuestion({ ...question, allowBack: e.target.checked })}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                />
                                <span className="text-sm text-slate-700 font-medium">Allow Back Navigation</span>
                            </label>
                        </div>
                    </div>

                    {(question.type === 'multiple_choice' || question.type === 'single_choice' || question.type === 'multi_select') && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">
                                Answer Options
                            </label>
                            <div className="space-y-3">
                                {question.options?.map((option, index) => (
                                    <div key={index} className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium text-slate-500">Option {index + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newOptions = question.options?.filter((_, i) => i !== index);
                                                    setQuestion({ ...question, options: newOptions });
                                                }}
                                                className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="col-span-1">
                                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                                    Label (Display Text)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={option.label}
                                                    onChange={(e) => {
                                                        const newOptions = [...(question.options || [])];
                                                        newOptions[index] = { ...option, label: e.target.value };
                                                        setQuestion({ ...question, options: newOptions });
                                                    }}
                                                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border"
                                                    placeholder="e.g., Strongly Agree"
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                                    Value (Data)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={option.value}
                                                    onChange={(e) => {
                                                        const newOptions = [...(question.options || [])];
                                                        newOptions[index] = { ...option, value: e.target.value };
                                                        setQuestion({ ...question, options: newOptions });
                                                    }}
                                                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border"
                                                    placeholder="e.g., strongly_agree"
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                                    Score
                                                </label>
                                                <input
                                                    type="number"
                                                    value={option.score || 0}
                                                    onChange={(e) => {
                                                        const newOptions = [...(question.options || [])];
                                                        newOptions[index] = { ...option, score: parseInt(e.target.value) || 0 };
                                                        setQuestion({ ...question, options: newOptions });
                                                    }}
                                                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                                    Icon/Emoji (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={option.icon || ''}
                                                    onChange={(e) => {
                                                        const newOptions = [...(question.options || [])];
                                                        newOptions[index] = { ...option, icon: e.target.value };
                                                        setQuestion({ ...question, options: newOptions });
                                                    }}
                                                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border"
                                                    placeholder="😊 or icon URL"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                                    Image URL (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={option.imageUrl || ''}
                                                    onChange={(e) => {
                                                        const newOptions = [...(question.options || [])];
                                                        newOptions[index] = { ...option, imageUrl: e.target.value };
                                                        setQuestion({ ...question, options: newOptions });
                                                    }}
                                                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>

                                        {(option.imageUrl || option.icon) && (
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                                        Image Size
                                                    </label>
                                                    <select
                                                        value={option.imageSize || 'md'}
                                                        onChange={(e) => {
                                                            const newOptions = [...(question.options || [])];
                                                            newOptions[index] = { ...option, imageSize: e.target.value as 'sm' | 'md' | 'lg' };
                                                            setQuestion({ ...question, options: newOptions });
                                                        }}
                                                        className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border"
                                                    >
                                                        <option value="sm">Small</option>
                                                        <option value="md">Medium</option>
                                                        <option value="lg">Large</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-600 mb-1">
                                                        Image Position
                                                    </label>
                                                    <select
                                                        value={option.imagePosition || 'left'}
                                                        onChange={(e) => {
                                                            const newOptions = [...(question.options || [])];
                                                            newOptions[index] = { ...option, imagePosition: e.target.value as 'left' | 'right' | 'top' | 'bottom' };
                                                            setQuestion({ ...question, options: newOptions });
                                                        }}
                                                        className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border"
                                                    >
                                                        <option value="left">Left</option>
                                                        <option value="right">Right</option>
                                                        <option value="top">Top</option>
                                                        <option value="bottom">Bottom</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setQuestion({
                                        ...question,
                                        options: [...(question.options || []), { label: '', value: '' }]
                                    })}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add Option
                                </button>
                            </div>
                        </div>
                    )}

                    {question.type === 'true_false' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">
                                True/False Labels
                            </label>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">
                                            True Label
                                        </label>
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
                                            className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5 border"
                                            placeholder="True"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">
                                            False Label
                                        </label>
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
                                            className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5 border"
                                            placeholder="False"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500">
                                    Customize the labels shown to users. Values will remain 'true' and 'false' in the data.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Layout Editor */}
                    <div className="border-t border-slate-200 pt-6 mt-6">
                        <h3 className="text-lg font-medium text-slate-900 mb-4">Layout & Ordering</h3>
                        <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            {normalizeStructureOrders(question.structure || defaultQuestionStructure).map((element, index, array) => (
                                <div key={element.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-slate-200">
                                    <div className="flex items-center gap-3">
                                        <span className="text-slate-400 font-mono text-xs w-6">{index + 1}</span>
                                        <span className="font-medium text-slate-700 capitalize">
                                            {element.id === 'backButton' ? 'Back Button' : element.id}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={element.location}
                                            onChange={(e) => {
                                                const newStructure = [...(question.structure || defaultQuestionStructure)];
                                                const elIndex = newStructure.findIndex(e => e.id === element.id);
                                                if (elIndex !== -1) {
                                                    newStructure[elIndex] = { ...element, location: e.target.value as any };
                                                    setQuestion({ ...question, structure: normalizeStructureOrders(newStructure) });
                                                }
                                            }}
                                            className="text-xs border-slate-200 rounded shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="outsideTop">Outside Top</option>
                                            <option value="card">Inside Card</option>
                                            <option value="outsideBottom">Outside Bottom</option>
                                        </select>
                                        <div className="flex flex-col gap-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const currentStructure = [...(question.structure || defaultQuestionStructure)];
                                                    const sortedStructure = normalizeStructureOrders(currentStructure);
                                                    const currentElementIndexInSorted = sortedStructure.findIndex(e => e.id === element.id);

                                                    if (currentElementIndexInSorted > 0) {
                                                        const prevElementInSorted = sortedStructure[currentElementIndexInSorted - 1];

                                                        const newStructure = currentStructure.map(item => {
                                                            if (item.id === element.id) return { ...item, order: prevElementInSorted.order };
                                                            if (item.id === prevElementInSorted.id) return { ...item, order: element.order };
                                                            return item;
                                                        });
                                                        setQuestion({ ...question, structure: normalizeStructureOrders(newStructure) });
                                                    }
                                                }}
                                                className="text-slate-400 hover:text-blue-600"
                                                disabled={index === 0}
                                            >
                                                ▲
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const currentStructure = [...(question.structure || defaultQuestionStructure)];
                                                    const sortedStructure = normalizeStructureOrders(currentStructure);
                                                    const currentElementIndexInSorted = sortedStructure.findIndex(e => e.id === element.id);

                                                    if (currentElementIndexInSorted < sortedStructure.length - 1) {
                                                        const nextElementInSorted = sortedStructure[currentElementIndexInSorted + 1];

                                                        const newStructure = currentStructure.map(item => {
                                                            if (item.id === element.id) return { ...item, order: nextElementInSorted.order };
                                                            if (item.id === nextElementInSorted.id) return { ...item, order: element.order };
                                                            return item;
                                                        });
                                                        setQuestion({ ...question, structure: normalizeStructureOrders(newStructure) });
                                                    }
                                                }}
                                                className="text-slate-400 hover:text-blue-600"
                                                disabled={index === array.length - 1}
                                            >
                                                ▼
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
                        >
                            Save Question
                        </button>
                    </div>
                </form>
            </div>

            {/* Preview Column */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">Live Preview</span>
                </div>

                <div
                    className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm min-h-[600px] flex items-center justify-center p-8"
                    style={{
                        backgroundColor: design?.colors.background || '#f8fafc',
                        backgroundImage: design?.colors.gradient || ((design?.colors.gradientStart && design?.colors.gradientEnd)
                            ? `linear-gradient(to bottom right, ${design.colors.gradientStart}, ${design.colors.gradientEnd})`
                            : undefined),
                        fontFamily: design?.typography.fontFamily === 'inter' ? 'var(--font-inter)' :
                            design?.typography.fontFamily === 'outfit' ? 'var(--font-outfit)' :
                                design?.typography.fontFamily === 'poppins' ? 'Poppins, sans-serif' :
                                    design?.typography.fontFamily === 'playfair' ? 'Playfair Display, serif' :
                                        design?.typography.fontFamily === 'lora' ? 'Lora, serif' :
                                            design?.typography.fontFamily === 'roboto' ? 'Roboto, sans-serif' :
                                                design?.typography.fontFamily,
                        color: design?.colors.text
                    }}
                >
                    {/* Phone/Device Frame Simulation (Optional, keeping it simple for now) */}
                    <div className="w-full max-w-md relative z-10">
                        {design ? (
                            <QuestionCard
                                question={question as Question}
                                design={design}
                                onAnswer={() => { }}
                                selectedOptions={[]}
                                textAnswer=""
                            />
                        ) : (
                            <div className="text-center text-slate-400">
                                <p>Design configuration missing</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
