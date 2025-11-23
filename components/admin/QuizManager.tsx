'use client';

import { useState } from 'react';
import LeadFormEditor from '@/components/admin/LeadFormEditor';
import QuizEditor from '@/components/admin/QuizEditor';
import HubSpotIntegration from '@/components/admin/HubSpotIntegration';
import QuestionList from '@/components/admin/QuestionList';
import DesignEditor from '@/components/admin/DesignEditor';
import { Quiz, Question, DesignConfig, ThankYouPage, QuizSettings } from '@/types';
import { saveQuiz } from '@/app/actions/quiz';
import { Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ThankYouEditor from './ThankYouEditor';

interface QuizManagerProps {
    initialQuiz: Quiz;
}

export default function QuizManager({ initialQuiz }: QuizManagerProps) {
    const [quiz, setQuiz] = useState<Quiz>(initialQuiz);
    const [activeTab, setActiveTab] = useState<'settings' | 'questions' | 'design' | 'outcomes' | 'lead-form' | 'integrations'>('questions');
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

    const handleUpdateSettings = (settings: QuizSettings) => {
        setQuiz({ ...quiz, settings });
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
            {/* Tabs */}
            <div className="flex overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                <nav className="flex p-1 space-x-1 bg-slate-100 rounded-xl">
                    <button
                        onClick={() => setActiveTab('questions')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'questions'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                            }`}
                    >
                        Questions ({quiz.questions?.length || 0})
                    </button>
                    <button
                        onClick={() => setActiveTab('design')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'design'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                            }`}
                    >
                        Design
                    </button>
                    <button
                        onClick={() => setActiveTab('lead-form')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'lead-form'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                            }`}
                    >
                        Lead Form
                    </button>
                    <button
                        onClick={() => setActiveTab('integrations')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'integrations'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                            }`}
                    >
                        Integrations
                    </button>
                    <button
                        onClick={() => setActiveTab('outcomes')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'outcomes'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                            }`}
                    >
                        Outcomes ({quiz.thankYouPages?.length || 0})
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'settings'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                            }`}
                    >
                        Settings
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {activeTab === 'questions' && (
                    <QuestionList
                        questions={quiz.questions || []}
                        design={quiz.design!}
                        onUpdate={handleUpdateQuestions}
                    />
                )}
                {activeTab === 'design' && (
                    <DesignEditor quiz={quiz} onUpdate={handleUpdateDesign} />
                )}
                {activeTab === 'lead-form' && (
                    <LeadFormEditor quiz={quiz} onUpdate={handleUpdateSettings} />
                )}
                {activeTab === 'integrations' && (
                    <HubSpotIntegration quizId={quiz.id} quiz={quiz} />
                )}
                {activeTab === 'outcomes' && (
                    <ThankYouEditor
                        thankYouPages={quiz.thankYouPages || []}
                        onUpdate={handleUpdateThankYouPages}
                    />
                )}
                {activeTab === 'settings' && (
                    <QuizEditor initialData={quiz} />
                )}
            </div>
        </div>
    );
}
