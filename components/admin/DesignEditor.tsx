'use client';

import { useState, useEffect } from 'react';
import { DesignConfig, Quiz } from '@/types';
import { Palette, Type, Layout, Sparkles, Tag, Code, Image as ImageIcon } from 'lucide-react';

interface DesignEditorProps {
    quiz: Quiz;
    onUpdate: (design: DesignConfig) => void;
}

const defaultDesign: DesignConfig = {
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
};

// Theme presets
const themePresets: Record<string, Partial<DesignConfig>> = {
    modern: {
        colors: {
            primary: '#2563eb',
            background: '#f8fafc',
            text: '#0f172a',
            accent: '#3b82f6',
            secondary: '#8b5cf6',
        },
        layout: { cardStyle: 'glass', borderRadius: 'xl', shadow: 'lg' },
    },
    dark: {
        colors: {
            primary: '#60a5fa',
            background: '#0f172a',
            text: '#f1f5f9',
            accent: '#3b82f6',
            secondary: '#a78bfa',
        },
        layout: { cardStyle: 'solid', borderRadius: 'lg', shadow: 'md' },
    },
    vibrant: {
        colors: {
            primary: '#ec4899',
            background: '#fdf4ff',
            text: '#831843',
            accent: '#f472b6',
            secondary: '#a855f7',
            gradientStart: '#ec4899',
            gradientEnd: '#a855f7',
            gradientAngle: 135,
        },
        layout: { cardStyle: 'glass', borderRadius: 'full', shadow: 'lg' },
    },
    minimal: {
        colors: {
            primary: '#000000',
            background: '#ffffff',
            text: '#000000',
            accent: '#404040',
        },
        layout: { cardStyle: 'minimal', borderRadius: 'none', shadow: 'none' },
    },
    corporate: {
        colors: {
            primary: '#1e40af',
            background: '#f8fafc',
            text: '#1e293b',
            accent: '#3b82f6',
            secondary: '#0ea5e9',
        },
        layout: { cardStyle: 'solid', borderRadius: 'md', shadow: 'sm' },
    },
};

export default function DesignEditor({ quiz, onUpdate }: DesignEditorProps) {
    const [design, setDesign] = useState<DesignConfig>(quiz.design || defaultDesign);
    const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout' | 'animations' | 'branding' | 'advanced'>('colors');

    // Debounce updates to parent
    useEffect(() => {
        const timer = setTimeout(() => {
            onUpdate(design);
        }, 500);
        return () => clearTimeout(timer);
    }, [design, onUpdate]);

    const applyPreset = (presetName: string) => {
        const preset = themePresets[presetName];
        setDesign({
            ...design,
            ...preset,
            colors: { ...design.colors, ...preset.colors },
            typography: { ...design.typography, ...preset.typography },
            layout: { ...design.layout, ...preset.layout },
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Controls */}
            <div className="space-y-4 sm:space-y-6">
                {/* Theme Presets */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Start Themes</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {Object.keys(themePresets).map((preset) => (
                            <button
                                key={preset}
                                onClick={() => applyPreset(preset)}
                                className="px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all text-slate-700"
                            >
                                {preset.charAt(0).toUpperCase() + preset.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
                    {[
                        { id: 'colors', label: 'Colors', icon: Palette },
                        { id: 'typography', label: 'Typography', icon: Type },
                        { id: 'layout', label: 'Layout', icon: Layout },
                        { id: 'animations', label: 'Effects', icon: Sparkles },
                        { id: 'branding', label: 'Branding', icon: Tag },
                        { id: 'advanced', label: 'Advanced', icon: Code },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 min-w-[80px] py-2 px-2 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1 ${activeTab === tab.id
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-4 sm:space-y-6">
                    {activeTab === 'colors' && (
                        <div className="space-y-4">
                            {/* Basic Colors */}
                            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Basic Colors</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { key: 'primary', label: 'Primary' },
                                        { key: 'background', label: 'Background' },
                                        { key: 'text', label: 'Text' },
                                        { key: 'accent', label: 'Accent' },
                                    ].map(({ key, label }) => (
                                        <div key={key}>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={design.colors[key as keyof typeof design.colors] as string}
                                                    onChange={(e) => setDesign({ ...design, colors: { ...design.colors, [key]: e.target.value } })}
                                                    className="h-10 w-10 rounded-lg border border-slate-200 cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={design.colors[key as keyof typeof design.colors] as string}
                                                    onChange={(e) => setDesign({ ...design, colors: { ...design.colors, [key]: e.target.value } })}
                                                    className="flex-1 rounded-lg border-slate-300 text-sm"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Extended Colors */}
                            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Extended Palette</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { key: 'secondary', label: 'Secondary', default: '#8b5cf6' },
                                        { key: 'success', label: 'Success', default: '#10b981' },
                                        { key: 'warning', label: 'Warning', default: '#f59e0b' },
                                        { key: 'error', label: 'Error', default: '#ef4444' },
                                    ].map(({ key, label, default: defaultColor }) => (
                                        <div key={key}>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={design.colors[key as keyof typeof design.colors] as string || defaultColor}
                                                    onChange={(e) => setDesign({ ...design, colors: { ...design.colors, [key]: e.target.value } })}
                                                    className="h-8 w-8 rounded border border-slate-200 cursor-pointer"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const { [key]: _, ...rest } = design.colors;
                                                        setDesign({ ...design, colors: rest });
                                                    }}
                                                    className="text-xs text-slate-500 hover:text-red-500"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Gradient */}
                            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Background Gradient</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Start</label>
                                            <input
                                                type="color"
                                                value={design.colors.gradientStart || design.colors.background}
                                                onChange={(e) => {
                                                    const start = e.target.value;
                                                    const end = design.colors.gradientEnd || design.colors.background;
                                                    const angle = design.colors.gradientAngle || 90;
                                                    setDesign({
                                                        ...design,
                                                        colors: {
                                                            ...design.colors,
                                                            gradientStart: start,
                                                            gradientEnd: end,
                                                            gradient: `linear-gradient(${angle}deg, ${start}, ${end})`
                                                        }
                                                    });
                                                }}
                                                className="h-10 w-full rounded-lg border border-slate-200 cursor-pointer"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">End</label>
                                            <input
                                                type="color"
                                                value={design.colors.gradientEnd || design.colors.background}
                                                onChange={(e) => {
                                                    const end = e.target.value;
                                                    const start = design.colors.gradientStart || design.colors.background;
                                                    const angle = design.colors.gradientAngle || 90;
                                                    setDesign({
                                                        ...design,
                                                        colors: {
                                                            ...design.colors,
                                                            gradientStart: start,
                                                            gradientEnd: end,
                                                            gradient: `linear-gradient(${angle}deg, ${start}, ${end})`
                                                        }
                                                    });
                                                }}
                                                className="h-10 w-full rounded-lg border border-slate-200 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Angle: {design.colors.gradientAngle || 90}°
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="360"
                                            value={design.colors.gradientAngle || 90}
                                            onChange={(e) => {
                                                const angle = parseInt(e.target.value);
                                                const start = design.colors.gradientStart || design.colors.background;
                                                const end = design.colors.gradientEnd || design.colors.background;
                                                setDesign({
                                                    ...design,
                                                    colors: {
                                                        ...design.colors,
                                                        gradientAngle: angle,
                                                        gradient: `linear-gradient(${angle}deg, ${start}, ${end})`
                                                    }
                                                });
                                            }}
                                            className="w-full"
                                        />
                                    </div>
                                    {design.colors.gradient && (
                                        <button
                                            onClick={() => setDesign({
                                                ...design,
                                                colors: {
                                                    ...design.colors,
                                                    gradient: undefined,
                                                    gradientStart: undefined,
                                                    gradientEnd: undefined,
                                                    gradientAngle: undefined
                                                }
                                            })}
                                            className="text-sm text-red-500 hover:text-red-700"
                                        >
                                            Remove Gradient
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'typography' && (
                        <div className="space-y-4">
                            {/* Font Selection */}
                            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Font Families</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Heading Font</label>
                                        <select
                                            value={design.typography.headingFont}
                                            onChange={(e) => setDesign({ ...design, typography: { ...design.typography, headingFont: e.target.value as any } })}
                                            className="w-full rounded-lg border-slate-300"
                                        >
                                            <option value="outfit">Outfit (Modern Sans)</option>
                                            <option value="inter">Inter (Clean Sans)</option>
                                            <option value="poppins">Poppins (Geometric Sans)</option>
                                            <option value="playfair">Playfair Display (Elegant Serif)</option>
                                            <option value="lora">Lora (Readable Serif)</option>
                                            <option value="roboto">Roboto (Neutral Sans)</option>
                                            <option value="serif">Serif (Classic)</option>
                                            <option value="mono">Monospace (Tech)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Body Font</label>
                                        <select
                                            value={design.typography.fontFamily}
                                            onChange={(e) => setDesign({ ...design, typography: { ...design.typography, fontFamily: e.target.value as any } })}
                                            className="w-full rounded-lg border-slate-300"
                                        >
                                            <option value="inter">Inter (Clean Sans)</option>
                                            <option value="outfit">Outfit (Modern Sans)</option>
                                            <option value="poppins">Poppins (Geometric Sans)</option>
                                            <option value="roboto">Roboto (Neutral Sans)</option>
                                            <option value="lora">Lora (Readable Serif)</option>
                                            <option value="serif">Serif (Classic)</option>
                                            <option value="mono">Monospace (Tech)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Typography Controls */}
                            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Typography Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Line Height</label>
                                        <select
                                            value={design.typography.lineHeight || 'normal'}
                                            onChange={(e) => setDesign({ ...design, typography: { ...design.typography, lineHeight: e.target.value as any } })}
                                            className="w-full rounded-lg border-slate-300"
                                        >
                                            <option value="tight">Tight</option>
                                            <option value="normal">Normal</option>
                                            <option value="relaxed">Relaxed</option>
                                            <option value="loose">Loose</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Letter Spacing</label>
                                        <select
                                            value={design.typography.letterSpacing || 'normal'}
                                            onChange={(e) => setDesign({ ...design, typography: { ...design.typography, letterSpacing: e.target.value as any } })}
                                            className="w-full rounded-lg border-slate-300"
                                        >
                                            <option value="tighter">Tighter</option>
                                            <option value="tight">Tight</option>
                                            <option value="normal">Normal</option>
                                            <option value="wide">Wide</option>
                                            <option value="wider">Wider</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'layout' && (
                        <div className="space-y-4">
                            {/* Card Style */}
                            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Card Style</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Style</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['glass', 'solid', 'minimal'].map((style) => (
                                                <button
                                                    key={style}
                                                    onClick={() => setDesign({ ...design, layout: { ...design.layout, cardStyle: style as any } })}
                                                    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${design.layout.cardStyle === style
                                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {style.charAt(0).toUpperCase() + style.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Border Radius</label>
                                            <select
                                                value={design.layout.borderRadius}
                                                onChange={(e) => setDesign({ ...design, layout: { ...design.layout, borderRadius: e.target.value as any } })}
                                                className="w-full rounded-lg border-slate-300"
                                            >
                                                <option value="none">None</option>
                                                <option value="sm">Small</option>
                                                <option value="md">Medium</option>
                                                <option value="lg">Large</option>
                                                <option value="xl">Extra Large</option>
                                                <option value="full">Full</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Shadow</label>
                                            <select
                                                value={design.layout.shadow}
                                                onChange={(e) => setDesign({ ...design, layout: { ...design.layout, shadow: e.target.value as any } })}
                                                className="w-full rounded-lg border-slate-300"
                                            >
                                                <option value="none">None</option>
                                                <option value="sm">Small</option>
                                                <option value="md">Medium</option>
                                                <option value="lg">Large</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Opacity ({Math.round((design.layout.opacity ?? 0.9) * 100)}%)
                                        </label>
                                        <input
                                            type="range"
                                            min="0.5"
                                            max="1"
                                            step="0.05"
                                            value={design.layout.opacity ?? 0.9}
                                            onChange={(e) => setDesign({ ...design, layout: { ...design.layout, opacity: parseFloat(e.target.value) } })}
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Spacing</label>
                                        <select
                                            value={design.layout.spacing || 'comfortable'}
                                            onChange={(e) => setDesign({ ...design, layout: { ...design.layout, spacing: e.target.value as any } })}
                                            className="w-full rounded-lg border-slate-300"
                                        >
                                            <option value="compact">Compact</option>
                                            <option value="comfortable">Comfortable</option>
                                            <option value="spacious">Spacious</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Max Width</label>
                                        <select
                                            value={design.layout.maxWidth || 'md'}
                                            onChange={(e) => setDesign({ ...design, layout: { ...design.layout, maxWidth: e.target.value as any } })}
                                            className="w-full rounded-lg border-slate-300"
                                        >
                                            <option value="sm">Small (480px)</option>
                                            <option value="md">Medium (640px)</option>
                                            <option value="lg">Large (768px)</option>
                                            <option value="xl">Extra Large (1024px)</option>
                                            <option value="full">Full Width</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'animations' && (
                        <div className="space-y-4">
                            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Animations & Effects</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-slate-700">Enable Animations</label>
                                        <input
                                            type="checkbox"
                                            checked={design.animations?.enabled !== false}
                                            onChange={(e) => setDesign({ ...design, animations: { ...design.animations, enabled: e.target.checked } })}
                                            className="h-5 w-5 rounded border-slate-300 text-blue-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Question Transition</label>
                                        <select
                                            value={design.animations?.questionTransition || 'slide'}
                                            onChange={(e) => setDesign({ ...design, animations: { ...design.animations, questionTransition: e.target.value as any } })}
                                            className="w-full rounded-lg border-slate-300"
                                        >
                                            <option value="fade">Fade</option>
                                            <option value="slide">Slide</option>
                                            <option value="scale">Scale</option>
                                            <option value="none">None</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Transition Speed</label>
                                        <select
                                            value={design.animations?.transitionDuration || 'normal'}
                                            onChange={(e) => setDesign({ ...design, animations: { ...design.animations, transitionDuration: e.target.value as any } })}
                                            className="w-full rounded-lg border-slate-300"
                                        >
                                            <option value="fast">Fast (150ms)</option>
                                            <option value="normal">Normal (300ms)</option>
                                            <option value="slow">Slow (500ms)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Button Hover Effect</label>
                                        <select
                                            value={design.animations?.buttonHoverEffect || 'lift'}
                                            onChange={(e) => setDesign({ ...design, animations: { ...design.animations, buttonHoverEffect: e.target.value as any } })}
                                            className="w-full rounded-lg border-slate-300"
                                        >
                                            <option value="lift">Lift</option>
                                            <option value="glow">Glow</option>
                                            <option value="scale">Scale</option>
                                            <option value="none">None</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Progress Bar</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-slate-700">Show Progress Bar</label>
                                        <input
                                            type="checkbox"
                                            checked={design.elements?.progressBar?.show !== false}
                                            onChange={(e) => setDesign({ ...design, elements: { ...design.elements, progressBar: { ...design.elements?.progressBar, show: e.target.checked } } })}
                                            className="h-5 w-5 rounded border-slate-300 text-blue-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Style</label>
                                        <select
                                            value={design.elements?.progressBar?.style || 'bar'}
                                            onChange={(e) => setDesign({ ...design, elements: { ...design.elements, progressBar: { ...design.elements?.progressBar, style: e.target.value as any } } })}
                                            className="w-full rounded-lg border-slate-300"
                                        >
                                            <option value="bar">Bar</option>
                                            <option value="dots">Dots</option>
                                            <option value="steps">Steps</option>
                                            <option value="percentage">Percentage</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Height</label>
                                        <select
                                            value={design.elements?.progressBar?.height || 'medium'}
                                            onChange={(e) => setDesign({ ...design, elements: { ...design.elements, progressBar: { ...design.elements?.progressBar, height: e.target.value as any } } })}
                                            className="w-full rounded-lg border-slate-300"
                                        >
                                            <option value="thin">Thin (2px)</option>
                                            <option value="medium">Medium (4px)</option>
                                            <option value="thick">Thick (8px)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'branding' && (
                        <div className="space-y-4">
                            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Logo</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
                                        <input
                                            type="text"
                                            value={design.branding?.logo?.url || ''}
                                            onChange={(e) => setDesign({ ...design, branding: { ...design.branding, logo: { ...design.branding?.logo, url: e.target.value } } })}
                                            placeholder="https://example.com/logo.png"
                                            className="w-full rounded-lg border-slate-300"
                                        />
                                    </div>
                                    {design.branding?.logo?.url && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
                                                <select
                                                    value={design.branding?.logo?.position || 'top-center'}
                                                    onChange={(e) => setDesign({ ...design, branding: { ...design.branding, logo: { ...design.branding?.logo, position: e.target.value as any, url: design.branding?.logo?.url || '' } } })}
                                                    className="w-full rounded-lg border-slate-300"
                                                >
                                                    <option value="top-left">Top Left</option>
                                                    <option value="top-center">Top Center</option>
                                                    <option value="top-right">Top Right</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Size</label>
                                                <select
                                                    value={design.branding?.logo?.size || 'md'}
                                                    onChange={(e) => setDesign({ ...design, branding: { ...design.branding, logo: { ...design.branding?.logo, size: e.target.value as any, url: design.branding?.logo?.url || '' } } })}
                                                    className="w-full rounded-lg border-slate-300"
                                                >
                                                    <option value="sm">Small (32px)</option>
                                                    <option value="md">Medium (48px)</option>
                                                    <option value="lg">Large (64px)</option>
                                                </select>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'advanced' && (
                        <div className="space-y-4">
                            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Custom CSS</h3>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Add custom CSS for advanced styling
                                    </label>
                                    <textarea
                                        value={design.advanced?.customCSS || ''}
                                        onChange={(e) => setDesign({ ...design, advanced: { ...design.advanced, customCSS: e.target.value } })}
                                        placeholder=".quiz-card { border: 2px solid red; }"
                                        className="w-full h-32 rounded-lg border-slate-300 font-mono text-sm"
                                    />
                                    <p className="text-xs text-slate-500">
                                        Use with caution. Invalid CSS may break your quiz layout.
                                    </p>
                                </div>
                            </div>

                            {/* Responsive */}
                            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Mobile Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Mobile Font Scale ({design.responsive?.mobileFontScale || 1}x)
                                        </label>
                                        <input
                                            type="range"
                                            min="0.8"
                                            max="1.2"
                                            step="0.1"
                                            value={design.responsive?.mobileFontScale || 1}
                                            onChange={(e) => setDesign({ ...design, responsive: { ...design.responsive, mobileFontScale: parseFloat(e.target.value) } })}
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Spacing</label>
                                        <select
                                            value={design.responsive?.mobileSpacing || 'normal'}
                                            onChange={(e) => setDesign({ ...design, responsive: { ...design.responsive, mobileSpacing: e.target.value as any } })}
                                            className="w-full rounded-lg border-slate-300"
                                        >
                                            <option value="tighter">Tighter</option>
                                            <option value="normal">Normal</option>
                                            <option value="looser">Looser</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Preview */}
            <div className="sticky top-8">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Live Preview</h3>
                <div
                    className="p-6 sm:p-8 rounded-3xl transition-all duration-300 border border-slate-200 shadow-sm"
                    style={{
                        backgroundColor: design.colors.background,
                        backgroundImage: design.colors.gradient,
                    }}
                >
                    {/* Logo Preview */}
                    {design.branding?.logo?.url && (
                        <div className={`mb-6 flex ${design.branding.logo.position === 'top-left' ? 'justify-start' :
                            design.branding.logo.position === 'top-right' ? 'justify-end' : 'justify-center'
                            }`}>
                            <img
                                src={design.branding.logo.url}
                                alt="Logo"
                                className="object-contain"
                                style={{
                                    height: design.branding.logo.size === 'sm' ? '32px' :
                                        design.branding.logo.size === 'lg' ? '64px' : '48px'
                                }}
                            />
                        </div>
                    )}

                    <div
                        className={`max-w-md mx-auto transition-all duration-300 ${design.layout.cardStyle === 'glass'
                            ? 'backdrop-blur-lg border border-white/20 shadow-xl'
                            : design.layout.cardStyle === 'solid'
                                ? 'bg-white shadow-lg border border-slate-100'
                                : 'bg-transparent border-2 border-slate-200'
                            }`}
                        style={{
                            backgroundColor: design.layout.cardStyle === 'glass'
                                ? `rgba(255, 255, 255, ${design.layout.opacity ?? 0.8})`
                                : design.layout.cardStyle === 'solid'
                                    ? '#ffffff'
                                    : 'transparent',
                            borderRadius: design.layout.borderRadius === 'full' ? '2rem' :
                                design.layout.borderRadius === 'xl' ? '1rem' :
                                    design.layout.borderRadius === 'lg' ? '0.75rem' :
                                        design.layout.borderRadius === 'md' ? '0.5rem' :
                                            design.layout.borderRadius === 'sm' ? '0.25rem' : '0',
                            padding: design.layout.spacing === 'compact' ? '1.5rem' :
                                design.layout.spacing === 'spacious' ? '3rem' : '2rem',
                        }}
                    >
                        <h2
                            className="text-xl sm:text-2xl font-bold mb-4"
                            style={{
                                color: design.colors.text,
                                fontFamily: design.typography.headingFont,
                                lineHeight: design.typography.lineHeight === 'tight' ? '1.25' :
                                    design.typography.lineHeight === 'relaxed' ? '1.625' :
                                        design.typography.lineHeight === 'loose' ? '2' : '1.5',
                                letterSpacing: design.typography.letterSpacing === 'tighter' ? '-0.05em' :
                                    design.typography.letterSpacing === 'tight' ? '-0.025em' :
                                        design.typography.letterSpacing === 'wide' ? '0.025em' :
                                            design.typography.letterSpacing === 'wider' ? '0.05em' : '0',
                            }}
                        >
                            Preview Question
                        </h2>
                        <p
                            className="mb-6 opacity-80 text-sm sm:text-base"
                            style={{
                                color: design.colors.text,
                                fontFamily: design.typography.fontFamily,
                            }}
                        >
                            This is how your quiz will look to your visitors.
                        </p>
                        <div className="space-y-3">
                            {[1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer"
                                    style={{
                                        borderColor: i === 1 ? design.colors.primary : '#e2e8f0',
                                        backgroundColor: i === 1 ? `${design.colors.primary}10` : 'transparent',
                                    }}
                                >
                                    <span style={{ color: design.colors.text }}>Option {i}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            className="w-full mt-6 py-3 px-4 rounded-lg font-medium text-white transition-all"
                            style={{
                                backgroundColor: design.colors.primary,
                                borderRadius: design.layout.borderRadius === 'full' ? '9999px' : '0.5rem',
                            }}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
