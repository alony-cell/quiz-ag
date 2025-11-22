'use client';

import { useState } from 'react';
import QuizEditor from '@/components/admin/QuizEditor';
import QuestionList from '@/components/admin/QuestionList';
import DesignEditor from '@/components/admin/DesignEditor';
import { Quiz, Question, DesignConfig, ThankYouPage } from '@/types';
import { saveQuiz } from '@/app/actions/quiz';
import { Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ThankYouEditor from './ThankYouEditor';

interface QuizManagerProps {
    initialQuiz: Quiz;
}

export default function QuizManager({ initialQuiz }: QuizManagerProps) {
    const [quiz, setQuiz] = useState<Quiz>(initialQuiz);
    const [activeTab, setActiveTab] = useState<'settings' | 'questions' | 'design' | 'outcomes'>('questions');
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleUpdateQuestions = (updatedQuestions: Question[]) => {
        setQuiz({ ...quiz, questions: updatedQuestions });
    };

    const handleUpdateDesign = (design: DesignConfig) => {
        setQuiz({ ...quiz, design });
    };

    const handleUpdateThankYouPages = (thankYouPages: ThankYouPage[]) => {
        setQuiz({ ...quiz, thankYouPages });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            console.log('QuizManager handleSave - quiz.questions:', quiz.questions);
            console.log('QuizManager handleSave - questions count:', quiz.questions?.length);

            const result = await saveQuiz({
                ...quiz,
                questions: quiz.questions || [],
            });

            console.log('QuizManager handleSave - result:', result);

            if (result.success) {
                router.refresh();
                alert('Quiz saved successfully!');
            } else {
                alert('Failed to save quiz: ' + result.error);
            }
        } catch (error) {
            console.error('Failed to save quiz:', error);
            alert('Failed to save quiz');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
                    Manage Quiz: {quiz.title}
                </h1>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors min-h-[44px] w-full sm:w-auto"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 -mx-4 sm:mx-0 px-4 sm:px-0">
                <nav className="-mb-px flex space-x-6 sm:space-x-8 overflow-x-auto scrollbar-hide">
                    <button
                        onClick={() => setActiveTab('questions')}
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors min-h-[44px] flex items-center ${activeTab === 'questions'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        Questions ({quiz.questions?.length || 0})
                    </button>
                    <button
                        onClick={() => setActiveTab('design')}
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors min-h-[44px] flex items-center ${activeTab === 'design'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        Design
                    </button>
                    <button
                        onClick={() => setActiveTab('outcomes')}
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors min-h-[44px] flex items-center ${activeTab === 'outcomes'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        Outcomes ({quiz.thankYouPages?.length || 0})
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors min-h-[44px] flex items-center ${activeTab === 'settings'
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
                ) : activeTab === 'outcomes' ? (
                    <ThankYouEditor
                        thankYouPages={quiz.thankYouPages || []}
                        onUpdate={handleUpdateThankYouPages}
                    />
                ) : (
                    <QuizEditor initialData={quiz} />
                )}
            </div>
        </div>
    );
}
