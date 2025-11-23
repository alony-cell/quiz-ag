export type QuestionType = 'multiple_choice' | 'text' | 'true_false' | 'rating' | 'multi_select' | 'content' | 'single_choice' | 'yes_no' | 'scale' | 'testimonial' | 'product';

export interface AnswerOption {
    value: string;
    label: string;
    icon?: string;        // Icon URL or emoji
    lucideIcon?: string;  // Lucide icon name (e.g., 'Heart', 'Star', 'Check')
    imageUrl?: string;    // Image URL
    imageSize?: 'sm' | 'md' | 'lg';
    imagePosition?: 'left' | 'right' | 'top' | 'bottom';
    score?: number;       // Score for this option
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
    answersLayout?: {
        columns?: number;  // 1, 2, 3, or 4
        gap?: 'sm' | 'md' | 'lg';
    };
    logic?: {
        condition: 'is' | 'isnt';  // 'is' = equals, 'isnt' = not equals
        value: string;              // The answer value to compare
        action: 'jump_to';
        target: string;             // questionId to jump to
    }[];
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
        useGradient?: boolean; // Toggle to enable/disable gradient
        // Phase 1: Enhanced colors
        secondary?: string;
        success?: string;
        warning?: string;
        error?: string;
        gradientAngle?: number; // 0-360 degrees
        gradientType?: 'linear' | 'radial' | 'conic';
        overlay?: string; // Color overlay on background image
        overlayOpacity?: number; // 0-1
    };
    typography: {
        fontFamily: 'inter' | 'outfit' | 'serif' | 'mono' | 'playfair' | 'lora' | 'roboto' | 'poppins';
        headingFont: 'inter' | 'outfit' | 'serif' | 'mono' | 'playfair' | 'lora' | 'roboto' | 'poppins';
        // Phase 1: Advanced typography
        fontSize?: {
            base?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
            scale?: number; // 0.8 - 1.5
        };
        fontWeight?: {
            normal?: 300 | 400 | 500;
            medium?: 500 | 600;
            bold?: 600 | 700 | 800;
        };
        lineHeight?: 'tight' | 'normal' | 'relaxed' | 'loose';
        letterSpacing?: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider';
        customFonts?: {
            url: string;
            family: string;
        }[];
    };
    layout: {
        cardStyle: 'glass' | 'solid' | 'minimal';
        borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
        shadow: 'none' | 'sm' | 'md' | 'lg';
        opacity?: number;
        spacing?: 'compact' | 'comfortable' | 'spacious';
        // Phase 2: Advanced layout
        maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
        cardBorder?: {
            width?: 'none' | 'thin' | 'medium' | 'thick';
            color?: string;
            style?: 'solid' | 'dashed' | 'dotted';
        };
        backgroundBlur?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    };
    elements?: {
        title?: {
            color?: string;
            fontSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
            alignment?: 'left' | 'center' | 'right';
            padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | number; // number in rem
        };
        description?: {
            color?: string;
            fontSize?: 'sm' | 'md' | 'lg';
            alignment?: 'left' | 'center' | 'right';
            padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | number; // number in rem
        };
        answers?: {
            backgroundColor?: string;
            textColor?: string;
            borderColor?: string;
            hoverColor?: string;
            selectedColor?: string;
            borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
            padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | number; // number in rem
            spacing?: 'tight' | 'normal' | 'relaxed' | number; // number in rem (gap)
            size?: 'sm' | 'md' | 'lg';
        };
        buttons?: {
            backgroundColor?: string;
            textColor?: string;
            borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
            padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | number; // number in rem
            fontSize?: number; // number in rem
            size?: 'sm' | 'md' | 'lg';
        };
        // Phase 1: Progress bar
        progressBar?: {
            show?: boolean;
            position?: 'top' | 'bottom';
            style?: 'bar' | 'dots' | 'steps' | 'percentage';
            color?: string;
            backgroundColor?: string;
            height?: 'thin' | 'medium' | 'thick';
            showPercentage?: boolean;
        };
        // Phase 2: Images
        images?: {
            borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
            aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
            objectFit?: 'cover' | 'contain' | 'fill';
            filter?: 'none' | 'grayscale' | 'sepia' | 'blur';
            overlay?: string;
            overlayOpacity?: number;
        };
    };
    backgroundImage?: string;
    // Phase 1: Animations
    animations?: {
        enabled?: boolean;
        questionTransition?: 'fade' | 'slide' | 'scale' | 'none';
        transitionDuration?: 'fast' | 'normal' | 'slow';
        buttonHoverEffect?: 'lift' | 'glow' | 'scale' | 'none';
        progressBarAnimation?: boolean;
    };
    // Phase 2: Header
    header?: {
        title?: string;
        subtitle?: string;
        backgroundColor?: string;
        textColor?: string;
        height?: 'sm' | 'md' | 'lg';
        logo?: {
            url: string;
            position?: 'left' | 'center' | 'right';
            size?: 'sm' | 'md' | 'lg';
            link?: string;
        };
        showPoweredBy?: boolean;
        poweredByText?: string;
    };
    // Keep branding for backward compatibility
    branding?: {
        logo?: {
            url: string;
            position?: 'top-left' | 'top-center' | 'top-right';
            size?: 'sm' | 'md' | 'lg';
            link?: string;
        };
        favicon?: string;
        poweredByText?: string;
        showPoweredBy?: boolean;
    };
    // Phase 3: Advanced features
    advanced?: {
        customCSS?: string;
        customHeadHTML?: string;
    };
    responsive?: {
        mobileFontScale?: number;
        mobileSpacing?: 'tighter' | 'normal' | 'looser';
        hideElementsOnMobile?: ('logo' | 'description' | 'progressBar')[];
    };
}

export interface ThankYouPage {
    id: string;
    quizId: string;
    title: string;
    content?: string;
    buttonText?: string;
    buttonUrl?: string;
    scoreRangeMin?: number;
    scoreRangeMax?: number;
    imageUrl?: string;
}

export interface HiddenField {
    id: string;
    name: string;
    sourceType: 'url_param' | 'referrer' | 'user_agent' | 'ip_address' | 'cookie' | 'constant';
    sourceKey?: string;
    constantValue?: string;
}

export interface QuizSettings {
    general: {
        showProgressBar: boolean;
        autoAdvance: boolean;
    };
    leadCapture: {
        enabled: boolean;
        fields: {
            id: string;
            type: 'email' | 'text' | 'phone' | 'checkbox';
            label: string;
            required: boolean;
            isBusinessEmail?: boolean;
            requiresVerification?: boolean;
        }[];
        hiddenFields?: HiddenField[];
    };
}

export interface Integration {
    id: string;
    quizId: string;
    type: string;
    config: any;
    isActive: boolean;
}

export interface HubSpotIntegration {
    portalId: string;
    formGuid: string;
    mappings: { source: string; hubspot: string }[];
}

export interface Quiz {
    id: string;
    title: string;
    slug: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    questions?: Question[];
    thankYouPages?: ThankYouPage[];
    design?: DesignConfig;
    settings?: QuizSettings;
}

export interface Lead {
    id: string;
    quizId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    createdAt: string;
    metadata?: Record<string, any>;
    hiddenData?: Record<string, any>;
    score?: number;
    outcome?: string;
}

export interface QuizResult {
    quizId: string;
    answers: Record<string, string>; // questionId -> answer value
    score?: number;
    outcome?: string;
}
