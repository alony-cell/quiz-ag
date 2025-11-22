'use client';

import { useState } from 'react';
import { Quiz, Question } from '@/types';
import { ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LeadForm from './LeadForm';
import ResultsView from './ResultsView';
import QuestionCard from './QuestionCard';

import { submitResponse } from '@/app/actions/response';

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

    const questions = quiz.questions || [];
    const currentQuestion = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    const handleAnswer = (questionId: string, value: string | string[]) => {
        setAnswers({ ...answers, [questionId]: value });
        // Reset local state
        setTextAnswer('');

        if (currentStep < questions.length - 1) {
            setTimeout(() => setCurrentStep(currentStep + 1), 300);
        } else {
            setTimeout(() => setQuizState('lead_capture'), 300);
        }
    };

    const handleLeadSubmit = async (data: { email: string; firstName?: string }) => {
        const timeTaken = Math.round((Date.now() - startTime) / 1000);

        await submitResponse({
            quizId: quiz.id,
            answers,
            timeTaken,
            lead: {
                email: data.email,
                name: data.firstName,
            }
        });

        setQuizState('results');
    };

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

    if (quizState === 'lead_capture') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <LeadForm onSubmit={handleLeadSubmit} />
            </motion.div>
        );
    }

    const design = quiz.design || {
        colors: { primary: '#2563eb', background: '#f8fafc', text: '#0f172a', accent: '#3b82f6' },
        typography: { fontFamily: 'inter', headingFont: 'outfit' },
        layout: { cardStyle: 'glass', borderRadius: 'xl', shadow: 'lg' },
    };

    const getCardStyle = () => {
        const base = "transition-all duration-300";
        const radius = design.layout.borderRadius === 'full' ? 'rounded-[2rem]' :
            design.layout.borderRadius === 'xl' ? 'rounded-2xl' :
                design.layout.borderRadius === 'lg' ? 'rounded-xl' :
                    design.layout.borderRadius === 'md' ? 'rounded-lg' :
                        design.layout.borderRadius === 'sm' ? 'rounded' : 'rounded-none';

        const shadow = design.layout.shadow === 'lg' ? 'shadow-xl' :
            design.layout.shadow === 'md' ? 'shadow-lg' :
                design.layout.shadow === 'sm' ? 'shadow-sm' : 'shadow-none';

        const padding = design.layout.spacing === 'compact' ? 'p-6' :
            design.layout.spacing === 'spacious' ? 'p-12' : 'p-8';

        if (design.layout.cardStyle === 'glass') {
            return `${base} ${radius} ${shadow} ${padding} backdrop-blur-lg border border-white/20`;
        }
        if (design.layout.cardStyle === 'solid') {
            return `${base} ${radius} ${shadow} ${padding} bg-white border border-slate-100`;
        }
        return `${base} ${radius} ${padding} bg-transparent border-2 border-slate-200`;
    };

    const cardInlineStyle = design.layout.cardStyle === 'glass' ? {
        backgroundColor: `rgba(255, 255, 255, ${design.layout.opacity ?? 0.8})`
    } : {};

    const fontStyle = {
        fontFamily: design.typography.fontFamily === 'inter' ? 'var(--font-inter)' :
            design.typography.fontFamily === 'outfit' ? 'var(--font-outfit)' :
                design.typography.fontFamily === 'poppins' ? 'Poppins, sans-serif' :
                    design.typography.fontFamily,
        color: design.colors.text,
    };

    const headingStyle = {
        fontFamily: design.typography.headingFont === 'outfit' ? 'var(--font-outfit)' :
            design.typography.headingFont === 'inter' ? 'var(--font-inter)' :
                design.typography.headingFont === 'poppins' ? 'Poppins, sans-serif' :
                    design.typography.headingFont,
        color: design.colors.text,
    };

    return (
        <div className="max-w-2xl mx-auto" style={fontStyle}>
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full"
                        style={{ backgroundColor: design.colors.primary }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <p className="text-sm mt-2 text-right font-medium" style={{ color: design.colors.text, opacity: 0.7 }}>
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
    );
}
