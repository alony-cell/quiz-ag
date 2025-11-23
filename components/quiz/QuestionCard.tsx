import { Question, DesignConfig } from '@/types';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

interface QuestionCardProps {
    question: Question;
    design: DesignConfig;
    onAnswer: (questionId: string, value: string | string[]) => void;
    selectedOptions?: string[];
    textAnswer?: string;
    onTextAnswerChange?: (value: string) => void;
    onSelectionChange?: (selected: string[]) => void;
    onBack?: () => void;
}

export default function QuestionCard({
    question,
    design,
    onAnswer,
    selectedOptions = [],
    textAnswer = '',
    onTextAnswerChange,
    onSelectionChange,
    onBack
}: QuestionCardProps) {
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

        const padding = design.layout.spacing === 'compact' ? 'p-4 sm:p-6' :
            design.layout.spacing === 'spacious' ? 'p-6 sm:p-12' : 'p-4 sm:p-8';

        if (design.layout.cardStyle === 'glass') {
            return `${base} ${radius} ${shadow} ${padding} backdrop-blur-lg border border-white/20`;
        }
        if (design.layout.cardStyle === 'solid') {
            return `${base} ${radius} ${shadow} ${padding} bg-white border border-slate-100`;
        }
        return `${base} ${radius} ${padding} bg-transparent border-2 border-slate-200`;
    };

    const getAnswerPadding = () => {
        const padding = design.elements?.answers?.padding;

        // If it's a number, use it directly as rem
        if (typeof padding === 'number') {
            return `p-[${padding}rem]`;
        }

        // Otherwise, handle old enum values
        switch (padding) {
            case 'none': return 'p-0';
            case 'sm': return 'p-2 sm:p-3';
            case 'lg': return 'p-4 sm:p-6';
            case 'xl': return 'p-6 sm:p-8';
            default: return 'p-3 sm:p-4'; // 'md' or undefined
        }
    };

    const getButtonSize = () => {
        const padding = design.elements?.buttons?.padding;
        const fontSize = design.elements?.buttons?.fontSize;
        const size = design.elements?.buttons?.size;

        // If we have numerical values, use them
        if (typeof padding === 'number' || typeof fontSize === 'number') {
            const paddingValue = typeof padding === 'number' ? padding : 1;
            const fontSizeValue = typeof fontSize === 'number' ? fontSize : 1;
            return `py-[${paddingValue * 0.75}rem] px-[${paddingValue * 1.5}rem] text-[${fontSizeValue}rem]`;
        }

        // Otherwise, handle old enum values
        switch (size) {
            case 'sm': return 'py-2 px-4 text-sm';
            case 'lg': return 'py-4 px-8 text-lg';
            default: return 'py-3 px-6 text-base';
        }
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
        color: design.elements?.title?.color || design.colors.text,
        textAlign: design.elements?.title?.alignment || 'left',
    };

    const descriptionStyle = {
        color: design.elements?.description?.color || design.colors.text,
        textAlign: design.elements?.description?.alignment || 'left',
    };

    const getButtonStyle = () => ({
        backgroundColor: design.elements?.buttons?.backgroundColor || design.colors.primary,
        color: design.elements?.buttons?.textColor || '#ffffff',
        borderRadius: design.elements?.buttons?.borderRadius === 'full' ? '9999px' :
            design.elements?.buttons?.borderRadius === 'xl' ? '1rem' :
                design.elements?.buttons?.borderRadius === 'lg' ? '0.75rem' :
                    design.elements?.buttons?.borderRadius === 'md' ? '0.5rem' :
                        design.elements?.buttons?.borderRadius === 'sm' ? '0.25rem' : '0',
    });

    const getAnswerStyle = (isSelected: boolean) => {
        const baseRadius = design.elements?.answers?.borderRadius === 'full' ? '9999px' :
            design.elements?.answers?.borderRadius === 'xl' ? '1rem' :
                design.elements?.answers?.borderRadius === 'lg' ? '0.75rem' :
                    design.elements?.answers?.borderRadius === 'md' ? '0.5rem' :
                        design.elements?.answers?.borderRadius === 'sm' ? '0.25rem' : '0';

        if (isSelected) {
            return {
                borderColor: design.colors.primary,
                backgroundColor: design.elements?.answers?.selectedColor || `${design.colors.primary}10`,
                color: design.colors.text,
                borderRadius: baseRadius,
            };
        }
        return {
            borderColor: design.elements?.answers?.borderColor || undefined,
            backgroundColor: design.elements?.answers?.backgroundColor || undefined,
            color: design.elements?.answers?.textColor || design.colors.text,
            borderRadius: baseRadius,
        };
    };

    const handleSingleChoiceSelection = (value: string) => {
        // If buttonText is present, we select but don't submit yet (delayed advance)
        if (question.buttonText) {
            onSelectionChange?.([value]);
        } else {
            // Otherwise, submit immediately
            onAnswer(question.id, value);
        }
    };

    const isNextDisabled = () => {
        if (question.type === 'text') return !textAnswer.trim();
        if (question.type === 'multi_select') return !selectedOptions.length;
        // For single choice with button text
        if (question.buttonText && (question.type === 'multiple_choice' || question.type === 'true_false' || question.type === 'rating')) {
            return !selectedOptions.length;
        }
        return false;
    };

    // Default structure if not provided
    const structure = question.structure || [
        { id: 'backButton', visible: true, location: 'card', order: 0 },
        { id: 'image', visible: true, location: 'card', order: 1 },
        { id: 'title', visible: true, location: 'card', order: 2 },
        { id: 'description', visible: true, location: 'card', order: 3 },
        { id: 'answers', visible: true, location: 'card', order: 4 },
        { id: 'button', visible: true, location: 'card', order: 5 }
    ];

    const renderElement = (id: string) => {
        switch (id) {
            case 'backButton':
                return question.allowBack && onBack ? (
                    <button
                        key="backButton"
                        onClick={onBack}
                        className="mb-4 text-sm font-medium opacity-60 hover:opacity-100 transition-opacity flex items-center"
                        style={{ color: design.colors.text }}
                    >
                        ← Back
                    </button>
                ) : null;

            case 'image':
                return question.imageUrl ? (
                    <div key="image" className="mb-4 sm:mb-6 rounded-xl overflow-hidden shadow-md">
                        <img
                            src={question.imageUrl}
                            alt={question.text}
                            className="w-full h-auto object-cover max-h-48 sm:max-h-64"
                        />
                    </div>
                ) : null;

            case 'title':
                return (
                    <h2 key="title" className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={headingStyle}>
                        {question.text}
                        {question.isRequired !== false && <span className="text-red-500 ml-1">*</span>}
                    </h2>
                );

            case 'description':
                return question.description ? (
                    <p key="description" className="text-base sm:text-lg mb-4 sm:mb-6 opacity-80" style={descriptionStyle}>
                        {question.description}
                    </p>
                ) : null;

            case 'answers':
                if (question.type === 'content') return null; // Content type doesn't have answers block, just button

                // Grid layout configuration
                const columns = question.answersLayout?.columns || 1;
                const layoutGap = question.answersLayout?.gap || 'md';
                const spacingSetting = design.elements?.answers?.spacing;
                // Determine gap class or style
                let gapClass = '';
                let gapStyle = {};
                if (typeof spacingSetting === 'number') {
                    gapStyle = { gap: `${spacingSetting}rem` };
                } else {
                    gapClass = spacingSetting === 'tight' ? 'gap-2' :
                        spacingSetting === 'relaxed' ? 'gap-4' :
                            layoutGap === 'sm' ? 'gap-2' :
                                layoutGap === 'lg' ? 'gap-4' : 'gap-3';
                }
                let gridColsClass = 'grid-cols-1';
                if (columns === 2) gridColsClass = 'grid-cols-2';
                if (columns === 3) gridColsClass = 'grid-cols-1 sm:grid-cols-3';
                if (columns === 4) gridColsClass = 'grid-cols-2 sm:grid-cols-4';

                const gridClass = `grid ${gridColsClass} ${gapClass}`;

                return (
                    <div key="answers" className={`mb-4 sm:mb-6 ${question.type === 'text' ? 'space-y-2 sm:space-y-3' : gridClass}`} style={gapStyle}>
                        {question.type === 'text' ? (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!isNextDisabled()) onAnswer(question.id, textAnswer);
                                }}
                            >
                                <input
                                    type="text"
                                    value={textAnswer}
                                    onChange={(e) => onTextAnswerChange?.(e.target.value)}
                                    className="w-full p-3 sm:p-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-base sm:text-lg min-h-[44px]"
                                    placeholder="Type your answer here..."
                                    autoFocus
                                    style={{
                                        borderRadius: design.elements?.answers?.borderRadius === 'full' ? '1.5rem' : undefined
                                    }}
                                />
                            </form>
                        ) : question.type === 'multi_select' ? (
                            question.options?.map((option, index) => {
                                const isSelected = (selectedOptions || []).includes(option.value);
                                const hasMedia = option.icon || option.imageUrl || option.lucideIcon;
                                const imageSize = option.imageSize || 'md';
                                const imagePosition = option.imagePosition || 'left';

                                const sizeClasses = {
                                    sm: 'w-6 h-6',
                                    md: 'w-10 h-10',
                                    lg: 'w-16 h-16'
                                };

                                const flexDirection = imagePosition === 'top' ? 'flex-col' :
                                    imagePosition === 'bottom' ? 'flex-col-reverse' :
                                        imagePosition === 'right' ? 'flex-row-reverse' : 'flex-row';

                                // Get Lucide icon component
                                const LucideIcon = option.lucideIcon ? (LucideIcons as any)[option.lucideIcon] : null;

                                return (
                                    <button
                                        key={`${option.value}-${index}`}
                                        onClick={() => {
                                            const current = selectedOptions || [];
                                            const newSelection = isSelected
                                                ? current.filter(v => v !== option.value)
                                                : [...current, option.value];
                                            onSelectionChange?.(newSelection);
                                        }}
                                        className={`w-full ${getAnswerPadding()} text-left border-2 transition-all flex items-center justify-between group bg-white min-h-[44px] ${isSelected
                                            ? 'border-blue-500'
                                            : 'border-slate-200 hover:border-blue-300'
                                            }`}
                                        style={getAnswerStyle(isSelected)}
                                    >
                                        <div className={`flex items-center gap-3 ${flexDirection} ${imagePosition === 'top' || imagePosition === 'bottom' ? 'w-full text-center' : ''}`}>
                                            {hasMedia && (
                                                <div className={`flex-shrink-0 ${sizeClasses[imageSize]}`}>
                                                    {option.imageUrl ? (
                                                        <img
                                                            src={option.imageUrl}
                                                            alt={option.label}
                                                            className={`${sizeClasses[imageSize]} object-cover rounded`}
                                                        />
                                                    ) : LucideIcon ? (
                                                        <LucideIcon className={sizeClasses[imageSize]} style={{ color: design.colors.primary }} />
                                                    ) : option.icon ? (
                                                        <span className="text-2xl">{option.icon}</span>
                                                    ) : null}
                                                </div>
                                            )}
                                            <span className="font-medium text-base sm:text-lg" style={fontStyle}>{option.label}</span>
                                        </div>
                                        {isSelected && (
                                            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: design.colors.primary }}>
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            question.options?.map((option, index) => {
                                const isSelected = (selectedOptions || []).includes(option.value);
                                const hasMedia = option.icon || option.imageUrl || option.lucideIcon;
                                const imageSize = option.imageSize || 'md';
                                const imagePosition = option.imagePosition || 'left';

                                const sizeClasses = {
                                    sm: 'w-6 h-6',
                                    md: 'w-10 h-10',
                                    lg: 'w-16 h-16'
                                };

                                const flexDirection = imagePosition === 'top' ? 'flex-col' :
                                    imagePosition === 'bottom' ? 'flex-col-reverse' :
                                        imagePosition === 'right' ? 'flex-row-reverse' : 'flex-row';

                                // Get Lucide icon component
                                const LucideIcon = option.lucideIcon ? (LucideIcons as any)[option.lucideIcon] : null;

                                return (
                                    <button
                                        key={`${option.value}-${index}`}
                                        onClick={() => handleSingleChoiceSelection(option.value)}
                                        className={`w-full text-left border-2 transition-all group bg-white min-h-[44px] ${isSelected
                                            ? 'border-blue-500'
                                            : 'border-slate-200 hover:border-blue-300'
                                            } ${design.elements?.answers?.padding === 'none' ? 'p-0' :
                                                design.elements?.answers?.padding === 'sm' ? 'p-2 sm:p-3' :
                                                    design.elements?.answers?.padding === 'lg' ? 'p-4 sm:p-6' :
                                                        design.elements?.answers?.padding === 'xl' ? 'p-6 sm:p-8' :
                                                            'p-3 sm:p-4'
                                            }`}
                                        style={{
                                            ...getAnswerStyle(isSelected),
                                            padding: typeof design.elements?.answers?.padding === 'number'
                                                ? `${design.elements.answers.padding}rem`
                                                : undefined,
                                        }}
                                    >
                                        <div className={`flex items-center gap-3 ${flexDirection} ${imagePosition === 'top' || imagePosition === 'bottom' ? 'w-full text-center' : ''}`}>
                                            {hasMedia && (
                                                <div className={`flex-shrink-0 ${sizeClasses[imageSize]}`}>
                                                    {option.imageUrl ? (
                                                        <img
                                                            src={option.imageUrl}
                                                            alt={option.label}
                                                            className={`${sizeClasses[imageSize]} object-cover rounded`}
                                                        />
                                                    ) : LucideIcon ? (
                                                        <LucideIcon className={sizeClasses[imageSize]} style={{ color: design.colors.primary }} />
                                                    ) : option.icon ? (
                                                        <span className="text-2xl">{option.icon}</span>
                                                    ) : null}
                                                </div>
                                            )}
                                            <span className="font-medium text-base sm:text-lg" style={fontStyle}>{option.label}</span>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                );

            case 'button':
                // Logic for showing buttons
                if (question.type === 'content') {
                    return (
                        <button
                            key="button"
                            onClick={() => onAnswer(question.id, 'continue')}
                            className={`w-full ${getButtonSize()} font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg min-h-[44px]`}
                            style={getButtonStyle()}
                        >
                            {question.buttonText || 'Continue'}
                        </button>
                    );
                }

                // For other types, we show buttons if needed
                const showSkip = question.isRequired === false && isNextDisabled();
                const showSubmit = question.type === 'text' || question.type === 'multi_select' || question.buttonText;

                if (!showSkip && !showSubmit) return null;

                return (
                    <div key="button" className="flex gap-2 sm:gap-3 mt-4">
                        {showSkip && (
                            <button
                                type="button"
                                onClick={() => onAnswer(question.id, question.type === 'multi_select' ? [] : '')}
                                className="flex-1 py-3 px-4 sm:px-6 rounded-xl font-semibold transition-all border-2 border-slate-200 hover:bg-slate-50 text-slate-600 min-h-[44px] text-sm sm:text-base"
                            >
                                Skip
                            </button>
                        )}
                        {showSubmit && (
                            <button
                                onClick={() => {
                                    if (question.type === 'text') {
                                        if (!isNextDisabled()) onAnswer(question.id, textAnswer);
                                    } else if (question.type === 'multi_select') {
                                        onAnswer(question.id, (selectedOptions || []).join(','));
                                    } else {
                                        onAnswer(question.id, (selectedOptions || [])[0]);
                                    }
                                }}
                                disabled={isNextDisabled() && question.isRequired !== false}
                                className={`flex-1 ${getButtonSize()} font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]`}
                                style={getButtonStyle()}
                            >
                                {question.buttonText || (question.type === 'text' ? 'Next' : 'Continue')}
                            </button>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    const sortedElements = [...structure].sort((a, b) => a.order - b.order);
    const outsideTopElements = sortedElements.filter(e => e.location === 'outsideTop' && e.visible);
    const cardElements = sortedElements.filter(e => e.location === 'card' && e.visible);
    const outsideBottomElements = sortedElements.filter(e => e.location === 'outsideBottom' && e.visible);

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Outside Top Elements */}
            <div className="mb-6 space-y-6">
                {outsideTopElements.map(e => renderElement(e.id))}
            </div>

            {/* Card Elements */}
            {cardElements.length > 0 && (
                <div
                    className={getCardStyle()}
                    style={cardInlineStyle}
                >
                    {cardElements.map(e => renderElement(e.id))}
                </div>
            )}

            {/* Outside Bottom Elements */}
            <div className="mt-6 space-y-6">
                {outsideBottomElements.map(e => renderElement(e.id))}
            </div>
        </div>
    );
}
