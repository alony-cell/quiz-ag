'use client';

import { useState } from 'react';
import { Quiz, Question } from '@/types';
import { ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LeadForm from './LeadForm';
import ResultsView from './ResultsView';
import QuestionCard from './QuestionCard';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { submitResponse } from '@/app/actions/response';
import { trackEvent } from '@/app/actions/analytics';

interface QuizEngineProps {
    quiz: Quiz;
}

export default function QuizEngine({ quiz }: QuizEngineProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [quizState, setQuizState] = useState<'question' | 'lead_capture' | 'results'>('question');
    const [textAnswer, setTextAnswer] = useState('');
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
    const [startTime] = useState(Date.now());
    const [sessionId] = useState(() => crypto.randomUUID());
    const searchParams = useSearchParams();
    const hasTrackedStart = useRef(false);

    const questions = quiz.questions || [];
    const currentQuestion = questions[currentStep];
    const progress = questions.length > 0 ? ((currentStep + 1) / questions.length) * 100 : 0;

    useEffect(() => {
        if (!hasTrackedStart.current) {
            trackEvent({ quizId: quiz.id, sessionId, type: 'start' });
            hasTrackedStart.current = true;
        }
    }, [quiz.id, sessionId]);

    useEffect(() => {
        if (currentQuestion) {
            trackEvent({
                quizId: quiz.id,
                sessionId,
                type: 'view',
                metadata: { questionId: currentQuestion.id }
            });
        }
    }, [currentQuestion, quiz.id, sessionId]);

    const handleAnswer = (questionId: string, value: string | string[]) => {
        setAnswers({ ...answers, [questionId]: value });
        trackEvent({
            quizId: quiz.id,
            sessionId,
            type: 'answer',
            metadata: { questionId, value }
        });

        // Reset local state
        setTextAnswer('');

        if (currentStep < questions.length - 1) {
            setTimeout(() => setCurrentStep(currentStep + 1), 300);
        } else {
            setTimeout(() => setQuizState('lead_capture'), 300);
        }
    };

    const handleLeadSubmit = async (data: Record<string, any>) => {
        const timeTaken = Math.round((Date.now() - startTime) / 1000);

        // Calculate Score
        let score = 0;
        questions.forEach(q => {
            const answer = answers[q.id];
            if (Array.isArray(answer)) {
                // Multi-select: sum of selected options
                answer.forEach(val => {
                    const option = q.options?.find(o => o.value === val);
                    if (option?.score) score += option.score;
                });
            } else {
                // Single select
                const option = q.options?.find(o => o.value === answer);
                if (option?.score) score += option.score;
            }
        });

        // Determine Outcome
        let outcome = 'Default Outcome';
        if (quiz.thankYouPages && quiz.thankYouPages.length > 0) {
            const matchedPage = quiz.thankYouPages.find(p =>
                score >= (p.scoreRangeMin || 0) && score <= (p.scoreRangeMax || 100)
            );
            if (matchedPage) outcome = matchedPage.title;
        }

        // Collect Hidden Data
        const hiddenData: Record<string, any> = {};

        if (quiz.settings?.leadCapture?.hiddenFields && quiz.settings.leadCapture.hiddenFields.length > 0) {
            quiz.settings.leadCapture.hiddenFields.forEach(field => {
                try {
                    if (field.sourceType === 'url_param' && field.sourceKey) {
                        const val = searchParams.get(field.sourceKey);
                        if (val) hiddenData[field.name] = val;
                    } else if (field.sourceType === 'constant' && field.constantValue) {
                        hiddenData[field.name] = field.constantValue;
                    } else if (field.sourceType === 'referrer') {
                        hiddenData[field.name] = document.referrer;
                    } else if (field.sourceType === 'user_agent') {
                        hiddenData[field.name] = navigator.userAgent;
                    } else if (field.sourceType === 'cookie' && field.sourceKey) {
                        const match = document.cookie.match(new RegExp('(^| )' + field.sourceKey + '=([^;]+)'));
                        if (match) hiddenData[field.name] = match[2];
                    }
                } catch (e) {
                    console.error(`Failed to capture hidden field ${field.name}:`, e);
                }
            });
        } else {
            // Fallback to legacy behavior
            searchParams.forEach((value, key) => {
                if (key.startsWith('utm_') || key === 'ref') {
                    hiddenData[key] = value;
                }
            });
            hiddenData.userAgent = navigator.userAgent;
        }

        await submitResponse({
            quizId: quiz.id,
            answers,
            timeTaken,
            lead: {
                email: data.email,
                firstName: data.firstName || (data.name ? data.name.split(' ')[0] : null),
                lastName: data.lastName || (data.name ? data.name.split(' ').slice(1).join(' ') : null),
                phone: data.phone,
                country: data.country,
                metadata: data,
                hiddenData,
                score,
                outcome,
            }
        });

        trackEvent({
            quizId: quiz.id,
            sessionId,
            type: 'complete',
            metadata: { score, outcome }
        });

        setQuizState('results');
    };

    const design = quiz.design || {
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
            cardStyle: 'glass' as const,
            borderRadius: 'xl' as const,
            shadow: 'lg' as const,
        },
    };

    const fontStyle = {
        fontFamily: design.typography.fontFamily === 'inter' ? 'var(--font-inter)' :
            design.typography.fontFamily === 'outfit' ? 'var(--font-outfit)' :
                design.typography.fontFamily === 'poppins' ? 'Poppins, sans-serif' :
                    design.typography.fontFamily === 'playfair' ? 'Playfair Display, serif' :
                        design.typography.fontFamily === 'lora' ? 'Lora, serif' :
                            design.typography.fontFamily === 'roboto' ? 'Roboto, sans-serif' :
                                design.typography.fontFamily,
    };

    // Show lead form if quiz state is lead_capture
    if (quizState === 'lead_capture') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: design.colors.background, backgroundImage: design.colors.useGradient !== false ? design.colors.gradient : undefined }}>
                <LeadForm
                    fields={quiz.settings?.leadCapture.fields}
                    onSubmit={handleLeadSubmit}
                />
            </div>
        );
    }

    // Show results if quiz state is results
    if (quizState === 'results') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <ResultsView />
            </motion.div>
        );
    }

    // Error state: No questions
    if (questions.length === 0 || !currentQuestion) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ backgroundColor: design.colors.background }}>
                <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Quiz Not Ready</h2>
                    <p className="text-slate-600 mb-4">
                        This quiz doesn't have any questions yet. Please contact the quiz creator to add questions.
                    </p>
                    <p className="text-sm text-slate-500">
                        Quiz ID: {quiz.id}
                    </p>
                </div>
            </div>
        );
    }

    // Main quiz view
    return (
        <div className="min-h-screen flex flex-col items-start justify-start" style={{ backgroundColor: design.colors.background, backgroundImage: design.colors.useGradient !== false ? design.colors.gradient : undefined }} {...fontStyle}>
            {/* Header */}
            {design.header && (design.header.title || design.header.subtitle || design.header.logo) && (
                <div
                    className={`w-full ${design.header.height === 'sm' ? 'py-4' :
                        design.header.height === 'lg' ? 'py-12' :
                            'py-8'
                        }`}
                    style={{
                        backgroundColor: design.header.backgroundColor || design.colors.primary,
                        color: design.header.textColor || '#ffffff'
                    }}
                >
                    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className={`flex items-center gap-4 ${design.header.logo?.position === 'left' ? 'justify-start' :
                            design.header.logo?.position === 'right' ? 'justify-end' :
                                'justify-center'
                            }`}>
                            {design.header.logo?.url && (
                                <img
                                    src={design.header.logo.url}
                                    alt="Logo"
                                    className={`${design.header.logo.size === 'sm' ? 'h-8' :
                                        design.header.logo.size === 'lg' ? 'h-16' :
                                            'h-12'
                                        }`}
                                />
                            )}
                            {(design.header.title || design.header.subtitle) && (
                                <div className="text-center">
                                    {design.header.title && (
                                        <h1 className="text-2xl sm:text-3xl font-bold">{design.header.title}</h1>
                                    )}
                                    {design.header.subtitle && (
                                        <p className="text-sm sm:text-base opacity-90 mt-1">{design.header.subtitle}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 flex items-start justify-center p-4 sm:p-6 lg:p-8 pt-8 md:pt-12 w-full">
                <div className="max-w-2xl mx-auto px-2 sm:px-0 w-full" style={fontStyle}>
                    {/* Progress Bar */}
                    <div className="mb-6 sm:mb-8">
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full"
                                style={{ backgroundColor: design.colors.primary }}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <p className="text-xs sm:text-sm mt-2 text-right font-medium" style={{ color: design.colors.text, opacity: 0.7 }}>
                            Question {currentStep + 1} of {questions.length}
                        </p>
                    </div>

                    {/* Question Card */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            <QuestionCard
                                question={currentQuestion}
                                design={design}
                                onAnswer={handleAnswer}
                                selectedOptions={selectedOptions[currentQuestion.id] || []}
                                textAnswer={textAnswer}
                                onTextAnswerChange={setTextAnswer}
                                onSelectionChange={(newSelection) => {
                                    setSelectedOptions({
                                        ...selectedOptions,
                                        [currentQuestion.id]: newSelection
                                    });
                                }}
                                onBack={currentStep > 0 ? () => setCurrentStep(currentStep - 1) : undefined}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
