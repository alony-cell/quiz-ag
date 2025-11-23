'use client';

import { useState } from 'react';
import { Quiz, QuizSettings, HiddenField } from '@/types';
import { Plus, Trash2, GripVertical, Mail, Type, Phone, CheckSquare, EyeOff, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeadFormEditorProps {
    quiz: Quiz;
    onUpdate: (settings: QuizSettings) => void;
}

const defaultSettings: QuizSettings = {
    general: {
        showProgressBar: true,
        autoAdvance: true,
    },
    leadCapture: {
        enabled: false,
        fields: [
            { id: 'email', type: 'email', label: 'Email Address', required: true },
            { id: 'name', type: 'text', label: 'Full Name', required: true },
        ],
    },
};

export default function LeadFormEditor({ quiz, onUpdate }: LeadFormEditorProps) {
    const [settings, setSettings] = useState<QuizSettings>(quiz.settings || defaultSettings);
    const [editingHiddenField, setEditingHiddenField] = useState<HiddenField | null>(null);
    const [isAddingHidden, setIsAddingHidden] = useState(false);

    const updateSettings = (newSettings: QuizSettings) => {
        setSettings(newSettings);
        onUpdate(newSettings);
    };

    const toggleLeadCapture = (enabled: boolean) => {
        updateSettings({
            ...settings,
            leadCapture: {
                ...settings.leadCapture,
                enabled,
            },
        });
    };

    const addField = (type: 'text' | 'email' | 'phone' | 'checkbox') => {
        const newField = {
            id: `field-${Date.now()}`,
            type,
            label: type === 'email' ? 'Email Address' : type === 'phone' ? 'Phone Number' : 'New Field',
            required: type === 'email', // Email usually required
        };

        updateSettings({
            ...settings,
            leadCapture: {
                ...settings.leadCapture,
                fields: [...settings.leadCapture.fields, newField],
            },
        });
    };

    const removeField = (index: number) => {
        const newFields = [...settings.leadCapture.fields];
        newFields.splice(index, 1);
        updateSettings({
            ...settings,
            leadCapture: {
                ...settings.leadCapture,
                fields: newFields,
            },
        });
    };

    const updateField = (index: number, updates: Partial<typeof settings.leadCapture.fields[0]>) => {
        const newFields = [...settings.leadCapture.fields];
        newFields[index] = { ...newFields[index], ...updates };
        updateSettings({
            ...settings,
            leadCapture: {
                ...settings.leadCapture,
                fields: newFields,
            },
        });
    };

    const addHiddenField = (field: HiddenField) => {
        const currentHidden = settings.leadCapture.hiddenFields || [];
        updateSettings({
            ...settings,
            leadCapture: {
                ...settings.leadCapture,
                hiddenFields: [...currentHidden, field],
            },
        });
        setIsAddingHidden(false);
        setEditingHiddenField(null);
    };

    const removeHiddenField = (id: string) => {
        const currentHidden = settings.leadCapture.hiddenFields || [];
        updateSettings({
            ...settings,
            leadCapture: {
                ...settings.leadCapture,
                hiddenFields: currentHidden.filter(f => f.id !== id),
            },
        });
    };

    const updateHiddenField = (id: string, updates: Partial<HiddenField>) => {
        const currentHidden = settings.leadCapture.hiddenFields || [];
        updateSettings({
            ...settings,
            leadCapture: {
                ...settings.leadCapture,
                hiddenFields: currentHidden.map(f => f.id === id ? { ...f, ...updates } : f),
            },
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Enable/Disable Toggle */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Lead Capture Form</h3>
                    <p className="text-slate-500 text-sm mt-1">Collect contact information from quiz takers before showing results.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.leadCapture.enabled}
                        onChange={(e) => toggleLeadCapture(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>

            {/* Form Editor */}
            <AnimatePresence>
                {settings.leadCapture.enabled && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h4 className="font-semibold text-slate-900 mb-4">Form Fields</h4>

                            <div className="space-y-3">
                                {settings.leadCapture.fields.map((field, index) => (
                                    <div key={field.id} className="flex items-start gap-3 p-4 bg-slate-50/50 rounded-xl border border-slate-100 group hover:border-slate-200 transition-colors">
                                        <div className="mt-3 text-slate-400 cursor-move">
                                            <GripVertical className="w-5 h-5" />
                                        </div>

                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-4">
                                            {/* Field Type Icon */}
                                            <div className="sm:col-span-1 flex items-center justify-center h-10 w-10 bg-white rounded-lg border border-slate-200 text-slate-500 mt-1">
                                                {field.type === 'email' && <Mail className="w-5 h-5" />}
                                                {field.type === 'text' && <Type className="w-5 h-5" />}
                                                {field.type === 'phone' && <Phone className="w-5 h-5" />}
                                                {field.type === 'checkbox' && <CheckSquare className="w-5 h-5" />}
                                            </div>

                                            {/* Label Input */}
                                            <div className="sm:col-span-7">
                                                <label className="block text-xs font-medium text-slate-500 mb-1">Label</label>
                                                <input
                                                    type="text"
                                                    value={field.label}
                                                    onChange={(e) => updateField(index, { label: e.target.value })}
                                                    className="w-full rounded-md border-slate-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>

                                            {/* Options */}
                                            <div className="sm:col-span-4 flex items-center gap-4 mt-6">
                                                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={field.required}
                                                        onChange={(e) => updateField(index, { required: e.target.checked })}
                                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    Required
                                                </label>

                                                {field.type === 'email' && (
                                                    <>
                                                        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={field.isBusinessEmail || false}
                                                                onChange={(e) => updateField(index, { isBusinessEmail: e.target.checked })}
                                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            Business Only
                                                        </label>

                                                        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={field.requiresVerification || false}
                                                                onChange={(e) => updateField(index, { requiresVerification: e.target.checked })}
                                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            Verify Email
                                                        </label>
                                                    </>
                                                )}

                                                <button
                                                    onClick={() => removeField(index)}
                                                    className="ml-auto p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Remove field"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Field Buttons */}
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <p className="text-sm font-medium text-slate-700 mb-3">Add Field</p>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => addField('text')}
                                        className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                                    >
                                        <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center mr-2">
                                            <Type className="w-3.5 h-3.5 text-blue-500" />
                                        </div>
                                        Text Field
                                    </button>
                                    <button
                                        onClick={() => addField('email')}
                                        className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                                    >
                                        <div className="w-6 h-6 rounded-lg bg-purple-50 flex items-center justify-center mr-2">
                                            <Mail className="w-3.5 h-3.5 text-purple-500" />
                                        </div>
                                        Email
                                    </button>
                                    <button
                                        onClick={() => addField('phone')}
                                        className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                                    >
                                        <div className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center mr-2">
                                            <Phone className="w-3.5 h-3.5 text-green-500" />
                                        </div>
                                        Phone
                                    </button>
                                    <button
                                        onClick={() => addField('checkbox')}
                                        className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                                    >
                                        <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center mr-2">
                                            <CheckSquare className="w-3.5 h-3.5 text-orange-500" />
                                        </div>
                                        Checkbox
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Hidden Fields Section */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h4 className="font-semibold text-slate-900">Hidden Fields</h4>
                                    <p className="text-sm text-slate-500">Capture data without user input (e.g., UTM params)</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingHiddenField({
                                            id: `hidden-${Date.now()}`,
                                            name: '',
                                            sourceType: 'url_param',
                                            sourceKey: '',
                                        });
                                        setIsAddingHidden(true);
                                    }}
                                    className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Hidden Field
                                </button>
                            </div>

                            <div className="space-y-3">
                                {settings.leadCapture.hiddenFields?.map((field) => (
                                    <div key={field.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center h-10 w-10 bg-white rounded-lg border border-slate-200 text-slate-500">
                                                <EyeOff className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{field.name}</p>
                                                <p className="text-xs text-slate-500">
                                                    {field.sourceType === 'url_param' ? `URL Param: ${field.sourceKey}` :
                                                        field.sourceType === 'constant' ? `Constant: ${field.constantValue}` :
                                                            field.sourceType === 'cookie' ? `Cookie: ${field.sourceKey}` :
                                                                field.sourceType.replace('_', ' ').toUpperCase()}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeHiddenField(field.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {(!settings.leadCapture.hiddenFields || settings.leadCapture.hiddenFields.length === 0) && (
                                    <div className="text-center py-6 text-slate-400 text-sm italic">
                                        No hidden fields configured.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hidden Field Modal/Form */}
                        {isAddingHidden && editingHiddenField && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                                <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                        <h3 className="font-bold text-slate-900">Create Hidden Field</h3>
                                        <button onClick={() => setIsAddingHidden(false)} className="text-slate-400 hover:text-slate-600">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Field Name</label>
                                            <input
                                                type="text"
                                                value={editingHiddenField.name}
                                                onChange={(e) => setEditingHiddenField({ ...editingHiddenField, name: e.target.value })}
                                                placeholder="e.g., utm_source"
                                                className="w-full rounded-lg border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Source Type</label>
                                            <select
                                                value={editingHiddenField.sourceType}
                                                onChange={(e) => setEditingHiddenField({ ...editingHiddenField, sourceType: e.target.value as any })}
                                                className="w-full rounded-lg border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="url_param">URL Parameter</option>
                                                <option value="referrer">Referrer</option>
                                                <option value="user_agent">User Agent</option>
                                                <option value="ip_address">IP Address</option>
                                                <option value="cookie">Cookie</option>
                                                <option value="constant">Constant Value</option>
                                            </select>
                                        </div>
                                        {editingHiddenField.sourceType === 'url_param' && (
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">URL Parameter Key</label>
                                                <input
                                                    type="text"
                                                    value={editingHiddenField.sourceKey || ''}
                                                    onChange={(e) => setEditingHiddenField({ ...editingHiddenField, sourceKey: e.target.value })}
                                                    placeholder="e.g., utm_source"
                                                    className="w-full rounded-lg border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        )}
                                        {editingHiddenField.sourceType === 'cookie' && (
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Cookie Name</label>
                                                <input
                                                    type="text"
                                                    value={editingHiddenField.sourceKey || ''}
                                                    onChange={(e) => setEditingHiddenField({ ...editingHiddenField, sourceKey: e.target.value })}
                                                    placeholder="e.g., _ga"
                                                    className="w-full rounded-lg border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        )}
                                        {editingHiddenField.sourceType === 'constant' && (
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Constant Value</label>
                                                <input
                                                    type="text"
                                                    value={editingHiddenField.constantValue || ''}
                                                    onChange={(e) => setEditingHiddenField({ ...editingHiddenField, constantValue: e.target.value })}
                                                    placeholder="e.g., organic"
                                                    className="w-full rounded-lg border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                        <button
                                            onClick={() => setIsAddingHidden(false)}
                                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => addHiddenField(editingHiddenField)}
                                            disabled={!editingHiddenField.name}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            Add Field
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Preview (Simplified) */}
                        <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 border-dashed flex items-center justify-center">
                            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <h5 className="text-center font-semibold text-slate-900 mb-6">Your Details</h5>
                                <div className="space-y-4">
                                    {settings.leadCapture.fields.map(field => (
                                        <div key={field.id}>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                {field.label} {field.required && <span className="text-red-500">*</span>}
                                            </label>
                                            {field.type === 'checkbox' ? (
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" className="rounded border-slate-300" />
                                                    <span className="text-sm text-slate-600">I agree to terms...</span>
                                                </div>
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    disabled
                                                    className="block w-full rounded-lg border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                                                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                                                />
                                            )}
                                        </div>
                                    ))}
                                    <button disabled className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium opacity-50 cursor-not-allowed mt-4">
                                        See Results
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
