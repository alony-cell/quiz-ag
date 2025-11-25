'use client';

import { useState } from 'react';
import LeadFormEditor from '@/components/admin/LeadFormEditor';
import QuizEditor from '@/components/admin/QuizEditor';
import HubSpotIntegration from '@/components/admin/HubSpotIntegration';
import FacebookIntegration from '@/components/admin/FacebookIntegration';
import QuestionList from '@/components/admin/QuestionList';
import DesignEditor from '@/components/admin/DesignEditor';
import { Quiz, Question, DesignConfig, ThankYouPage, QuizSettings } from '@/types';
import { saveQuiz } from '@/app/actions/quiz';
import { Loader2, Save, ArrowLeft, ExternalLink, List, Palette, UserPlus, Target, Plug, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThankYouEditor from './ThankYouEditor';

interface QuizManagerProps {
    initialQuiz: Quiz;
}

export default function QuizManager({ initialQuiz }: QuizManagerProps) {
    const [quiz, setQuiz] = useState<Quiz>(initialQuiz);
    const [activeTab, setActiveTab] = useState<'settings' | 'questions' | 'design' | 'outcomes' | 'lead-form' | 'integrations'>('questions');
    const [integrationTab, setIntegrationTab] = useState<'hubspot' | 'facebook'>('hubspot');
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const tabs = [
        { id: 'questions', label: 'Questions', icon: List },
        { id: 'design', label: 'Design', icon: Palette },
        { id: 'lead-form', label: 'Lead Form', icon: UserPlus },
        { id: 'outcomes', label: 'Outcomes', icon: Target },
        { id: 'integrations', label: 'Integrations', icon: Plug },
        { id: 'settings', label: 'Settings', icon: Settings },
    ] as const;

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
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/quizzes"
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 font-heading">{quiz.title}</h1>
                        <p className="text-sm text-slate-500">Last updated {new Date(quiz.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/quiz/${quiz.slug}`}
                        target="_blank"
                        className="flex items-center px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                    >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Preview
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center px-6 py-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-md shadow-blue-200 hover:shadow-lg hover:-translate-y-0.5"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 overflow-hidden mb-8">
                <div className="border-b border-slate-200/60 overflow-x-auto">
                    <div className="flex p-1 gap-1 min-w-max">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <tab.icon className={`w-4 h-4 mr-2 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6 bg-slate-50/30 min-h-[500px]">
                    {activeTab === 'questions' && (
                        <QuestionList
                            quizId={quiz.id}
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
                        <div className="space-y-6">
                            <div className="flex space-x-4 border-b border-slate-200 pb-2">
                                <button
                                    onClick={() => setIntegrationTab('hubspot')}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${integrationTab === 'hubspot'
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    HubSpot
                                </button>
                                <button
                                    onClick={() => setIntegrationTab('facebook')}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${integrationTab === 'facebook'
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    Facebook CAPI
                                </button>
                            </div>

                            {integrationTab === 'hubspot' ? (
                                <HubSpotIntegration quizId={quiz.id} quiz={quiz} />
                            ) : (
                                <FacebookIntegration quizId={quiz.id} />
                            )}
                        </div>
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
        </div>
    );
}
