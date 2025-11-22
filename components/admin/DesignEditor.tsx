'use client';

import { useState, useEffect } from 'react';
import { DesignConfig, Quiz } from '@/types';
import { Palette, Type, Layout, Image as ImageIcon } from 'lucide-react';

interface DesignEditorProps {
    quiz: Quiz;
    onUpdate: (design: DesignConfig) => void;
}

const defaultDesign: DesignConfig = {
    colors: {
        primary: '#2563eb', // blue-600
        background: '#f8fafc', // slate-50
        text: '#0f172a', // slate-900
        accent: '#3b82f6', // blue-500
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

export default function DesignEditor({ quiz, onUpdate }: DesignEditorProps) {
    const [design, setDesign] = useState<DesignConfig>(quiz.design || defaultDesign);
    const [activeTab, setActiveTab] = useState<'global' | 'elements'>('global');

    // Debounce updates to parent
    useEffect(() => {
        const timer = setTimeout(() => {
            onUpdate(design);
        }, 500);
        return () => clearTimeout(timer);
    }, [design, onUpdate]);

    const handleColorChange = (key: keyof DesignConfig['colors'], value: string) => {
        setDesign({
            ...design,
            colors: { ...design.colors, [key]: value },
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="space-y-6">
                {/* Tabs */}
                <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('global')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'global'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Global Theme
                    </button>
                    <button
                        onClick={() => setActiveTab('elements')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'elements'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Elements
                    </button>
                </div>

                {activeTab === 'global' ? (
                    <div className="space-y-8">
                        {/* Colors */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Palette className="w-5 h-5 text-blue-600" />
                                <h3 className="text-lg font-semibold text-slate-900">Colors</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Primary Color</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={design.colors.primary}
                                            onChange={(e) => handleColorChange('primary', e.target.value)}
                                            className="h-10 w-10 rounded-lg border border-slate-200 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={design.colors.primary}
                                            onChange={(e) => handleColorChange('primary', e.target.value)}
                                            className="flex-1 rounded-lg border-slate-300 text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Background</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={design.colors.background}
                                            onChange={(e) => handleColorChange('background', e.target.value)}
                                            className="h-10 w-10 rounded-lg border border-slate-200 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={design.colors.background}
                                            onChange={(e) => handleColorChange('background', e.target.value)}
                                            className="flex-1 rounded-lg border-slate-300 text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Text Color</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={design.colors.text}
                                            onChange={(e) => handleColorChange('text', e.target.value)}
                                            className="h-10 w-10 rounded-lg border border-slate-200 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={design.colors.text}
                                            onChange={(e) => handleColorChange('text', e.target.value)}
                                            className="flex-1 rounded-lg border-slate-300 text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Accent Color</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={design.colors.accent}
                                            onChange={(e) => handleColorChange('accent', e.target.value)}
                                            className="h-10 w-10 rounded-lg border border-slate-200 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={design.colors.accent}
                                            onChange={(e) => handleColorChange('accent', e.target.value)}
                                            className="flex-1 rounded-lg border-slate-300 text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Background Gradient</label>
                                    <div className="grid grid-cols-2 gap-4 mb-2">
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Start Color</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={design.colors.gradientStart || design.colors.background}
                                                    onChange={(e) => {
                                                        const start = e.target.value;
                                                        const end = design.colors.gradientEnd || design.colors.background;
                                                        setDesign({
                                                            ...design,
                                                            colors: {
                                                                ...design.colors,
                                                                gradientStart: start,
                                                                gradient: `linear-gradient(to right, ${start}, ${end})`
                                                            }
                                                        });
                                                    }}
                                                    className="h-8 w-8 rounded border border-slate-200 cursor-pointer"
                                                />
                                                <span className="text-xs text-slate-600">{design.colors.gradientStart || 'None'}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">End Color</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={design.colors.gradientEnd || design.colors.background}
                                                    onChange={(e) => {
                                                        const end = e.target.value;
                                                        const start = design.colors.gradientStart || design.colors.background;
                                                        setDesign({
                                                            ...design,
                                                            colors: {
                                                                ...design.colors,
                                                                gradientEnd: end,
                                                                gradient: `linear-gradient(to right, ${start}, ${end})`
                                                            }
                                                        });
                                                    }}
                                                    className="h-8 w-8 rounded border border-slate-200 cursor-pointer"
                                                />
                                                <span className="text-xs text-slate-600">{design.colors.gradientEnd || 'None'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {design.colors.gradient && (
                                        <button
                                            onClick={() => setDesign({
                                                ...design,
                                                colors: { ...design.colors, gradient: undefined, gradientStart: undefined, gradientEnd: undefined }
                                            })}
                                            className="text-xs text-red-500 hover:text-red-700"
                                        >
                                            Remove Gradient
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Typography */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Type className="w-5 h-5 text-blue-600" />
                                <h3 className="text-lg font-semibold text-slate-900">Typography</h3>
                            </div>
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

                        {/* Layout */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Layout className="w-5 h-5 text-blue-600" />
                                <h3 className="text-lg font-semibold text-slate-900">Layout & Style</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Card Style</label>
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
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Card Opacity ({Math.round((design.layout.opacity ?? 0.9) * 100)}%)
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
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Title & Description */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Title & Description</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Title Color</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={design.elements?.title?.color || design.colors.text}
                                            onChange={(e) => setDesign({ ...design, elements: { ...design.elements, title: { ...design.elements?.title, color: e.target.value } } })}
                                            className="h-10 w-10 rounded-lg border border-slate-200 cursor-pointer"
                                        />
                                        <button
                                            onClick={() => setDesign({ ...design, elements: { ...design.elements, title: { ...design.elements?.title, color: undefined } } })}
                                            className="text-xs text-slate-500 hover:text-red-500"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Alignment</label>
                                    <div className="flex gap-2">
                                        {['left', 'center', 'right'].map((align) => (
                                            <button
                                                key={align}
                                                onClick={() => setDesign({ ...design, elements: { ...design.elements, title: { ...design.elements?.title, alignment: align as any }, description: { ...design.elements?.description, alignment: align as any } } })}
                                                className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${design.elements?.title?.alignment === align
                                                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {align.charAt(0).toUpperCase() + align.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Answers */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Answers</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Background</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={design.elements?.answers?.backgroundColor || '#ffffff'}
                                                onChange={(e) => setDesign({ ...design, elements: { ...design.elements, answers: { ...design.elements?.answers, backgroundColor: e.target.value } } })}
                                                className="h-10 w-10 rounded-lg border border-slate-200 cursor-pointer"
                                            />
                                            <button
                                                onClick={() => setDesign({ ...design, elements: { ...design.elements, answers: { ...design.elements?.answers, backgroundColor: undefined } } })}
                                                className="text-xs text-slate-500 hover:text-red-500"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Text Color</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={design.elements?.answers?.textColor || design.colors.text}
                                                onChange={(e) => setDesign({ ...design, elements: { ...design.elements, answers: { ...design.elements?.answers, textColor: e.target.value } } })}
                                                className="h-10 w-10 rounded-lg border border-slate-200 cursor-pointer"
                                            />
                                            <button
                                                onClick={() => setDesign({ ...design, elements: { ...design.elements, answers: { ...design.elements?.answers, textColor: undefined } } })}
                                                className="text-xs text-slate-500 hover:text-red-500"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Border Radius</label>
                                    <select
                                        value={design.elements?.answers?.borderRadius || 'md'}
                                        onChange={(e) => setDesign({ ...design, elements: { ...design.elements, answers: { ...design.elements?.answers, borderRadius: e.target.value as any } } })}
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
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Buttons</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Background</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={design.elements?.buttons?.backgroundColor || design.colors.primary}
                                                onChange={(e) => setDesign({ ...design, elements: { ...design.elements, buttons: { ...design.elements?.buttons, backgroundColor: e.target.value } } })}
                                                className="h-10 w-10 rounded-lg border border-slate-200 cursor-pointer"
                                            />
                                            <button
                                                onClick={() => setDesign({ ...design, elements: { ...design.elements, buttons: { ...design.elements?.buttons, backgroundColor: undefined } } })}
                                                className="text-xs text-slate-500 hover:text-red-500"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Text Color</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={design.elements?.buttons?.textColor || '#ffffff'}
                                                onChange={(e) => setDesign({ ...design, elements: { ...design.elements, buttons: { ...design.elements?.buttons, textColor: e.target.value } } })}
                                                className="h-10 w-10 rounded-lg border border-slate-200 cursor-pointer"
                                            />
                                            <button
                                                onClick={() => setDesign({ ...design, elements: { ...design.elements, buttons: { ...design.elements?.buttons, textColor: undefined } } })}
                                                className="text-xs text-slate-500 hover:text-red-500"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Border Radius</label>
                                    <select
                                        value={design.elements?.buttons?.borderRadius || 'md'}
                                        onChange={(e) => setDesign({ ...design, elements: { ...design.elements, buttons: { ...design.elements?.buttons, borderRadius: e.target.value as any } } })}
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
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Preview */}
            <div className="sticky top-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Live Preview</h3>
                <div
                    className="p-8 rounded-3xl transition-all duration-300 border border-slate-200 shadow-sm"
                    style={{
                        backgroundColor: design.colors.background,
                        backgroundImage: design.colors.gradient,
                    }}
                >
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
                            className="text-2xl font-bold mb-4"
                            style={{
                                color: design.colors.text,
                                fontFamily: design.typography.headingFont === 'outfit' ? 'var(--font-outfit)' :
                                    design.typography.headingFont === 'inter' ? 'var(--font-inter)' :
                                        design.typography.headingFont === 'poppins' ? 'Poppins, sans-serif' :
                                            design.typography.headingFont,
                            }}
                        >
                            Preview Question
                        </h2>
                        <p
                            className="mb-6 opacity-80"
                            style={{
                                color: design.colors.text,
                                fontFamily: design.typography.fontFamily === 'inter' ? 'var(--font-inter)' :
                                    design.typography.fontFamily === 'outfit' ? 'var(--font-outfit)' :
                                        design.typography.fontFamily === 'poppins' ? 'Poppins, sans-serif' :
                                            design.typography.fontFamily,
                            }}
                        >
                            This is how your quiz will look to your visitors.
                        </p>
                        <div className="space-y-3">
                            {[1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="p-4 rounded-lg border-2 transition-all cursor-pointer"
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
