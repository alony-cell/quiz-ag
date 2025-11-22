export type QuestionType = 'multiple_choice' | 'text' | 'true_false' | 'rating' | 'multi_select' | 'content';

export interface AnswerOption {
    value: string;
    label: string;
    icon?: string;        // Icon URL or emoji
    imageUrl?: string;    // Image URL
    imageSize?: 'sm' | 'md' | 'lg';
    imagePosition?: 'left' | 'right' | 'top' | 'bottom';
}

export interface Question {
    id: string;
    quizId: string;
    text: string;
    description?: string;
    imageUrl?: string;
    buttonText?: string;
    type: QuestionType;
    order: number;
    options?: AnswerOption[];
    isActive: boolean;
    isRequired?: boolean;
    allowBack?: boolean;
    structure?: QuestionElement[];
}

export type QuestionElementId = 'image' | 'title' | 'description' | 'answers' | 'button' | 'backButton';

export interface QuestionElement {
    id: QuestionElementId;
    visible: boolean;
    location: 'card' | 'outsideTop' | 'outsideBottom';
    order: number;
}

export interface DesignConfig {
    colors: {
        primary: string;
        background: string;
        text: string;
        accent: string;
        gradient?: string;
        gradientStart?: string;
        gradientEnd?: string;
    };
    typography: {
        fontFamily: 'inter' | 'outfit' | 'serif' | 'mono' | 'playfair' | 'lora' | 'roboto' | 'poppins';
        headingFont: 'inter' | 'outfit' | 'serif' | 'mono' | 'playfair' | 'lora' | 'roboto' | 'poppins';
    };
    layout: {
        cardStyle: 'glass' | 'solid' | 'minimal';
        borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
        shadow: 'none' | 'sm' | 'md' | 'lg';
        opacity?: number;
        spacing?: 'compact' | 'comfortable' | 'spacious';
    };
    elements?: {
        title?: {
            color?: string;
            fontSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
            alignment?: 'left' | 'center' | 'right';
        };
        description?: {
            color?: string;
            fontSize?: 'sm' | 'md' | 'lg';
            alignment?: 'left' | 'center' | 'right';
        };
        answers?: {
            backgroundColor?: string;
            textColor?: string;
            hoverColor?: string;
            selectedColor?: string;
            borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
        };
        buttons?: {
            backgroundColor?: string;
            textColor?: string;
            borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
        };
    };
    backgroundImage?: string;
}

export interface Quiz {
    id: string;
    title: string;
    slug: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    questions?: Question[];
    design?: DesignConfig;
}

export interface Lead {
    id: string;
    quizId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    createdAt: string;
    metadata?: Record<string, any>;
}

export interface QuizResult {
    quizId: string;
    answers: Record<string, string>; // questionId -> answer value
    score?: number;
    outcome?: string;
}
