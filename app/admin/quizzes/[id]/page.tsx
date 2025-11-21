'use client';

import { useState, use } from 'react';
import QuizEditor from '@/components/admin/QuizEditor';
import QuestionList from '@/components/admin/QuestionList';
import DesignEditor from '@/components/admin/DesignEditor';
import { Quiz, Question, DesignConfig } from '@/types';

// Mock data fetcher
const getQuiz = (id: string): Quiz => {
    return {
        id,
        title: 'Marketing Strategy Quiz',
        slug: 'marketing-strategy',
        description: 'Assess your marketing maturity.',
        isActive: true,
        createdAt: new Date().toISOString(),
        questions: [
            {
                id: 'q1',
                quizId: id,
                text: 'What is your primary marketing goal?',
                type: 'multiple_choice',
                order: 1,
                isActive: true,
                options: [
                    { value: 'awareness', label: 'Brand Awareness' },
                    { value: 'leads', label: 'Lead Generation' },
                ],
            },
        ],
        design: {
            colors: {
                primary: '#2563eb',
                background: '#f8fafc',
                text: '#0f172a',
                accent: '#3b82f6',
            },
            typography: {
                fontFamily: 'inter',
                headingFont: 'outfit',
            },
            layout: {
                cardStyle: 'glass',
                borderRadius: 'xl',
                shadow: 'lg',
            },
        }
    };
};

export default function EditQuizPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [quiz, setQuiz] = useState<Quiz>(getQuiz(id));
    const [activeTab, setActiveTab] = useState<'settings' | 'questions' | 'design'>('questions');

    const handleUpdateQuestions = (updatedQuestions: Question[]) => {
        setQuiz({ ...quiz, questions: updatedQuestions });
        console.log('Updated questions:', updatedQuestions);
    };

    const handleUpdateDesign = (design: DesignConfig) => {
        setQuiz({ ...quiz, design });
        console.log('Updated design:', design);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-900 font-heading">
                    Manage Quiz: {quiz.title}
                </h1>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('questions')}
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'questions'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        Questions ({quiz.questions?.length || 0})
                    </button>
                    <button
                        onClick={() => setActiveTab('design')}
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'design'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        Design
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'settings'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        Settings
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {activeTab === 'questions' ? (
                    <QuestionList
                        questions={quiz.questions || []}
                        design={quiz.design!}
                        onUpdate={handleUpdateQuestions}
                    />
                ) : activeTab === 'design' ? (
                    <DesignEditor quiz={quiz} onUpdate={handleUpdateDesign} />
                ) : (
                    <QuizEditor initialData={quiz} />
                )}
            </div>
        </div>
    );
}
