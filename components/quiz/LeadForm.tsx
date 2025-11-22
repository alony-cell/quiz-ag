'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface LeadFormProps {
    fields?: {
        id: string;
        type: 'email' | 'text' | 'phone' | 'checkbox';
        label: string;
        required: boolean;
        placeholder?: string;
    }[];
    onSubmit: (data: Record<string, any>) => void;
    isSubmitting?: boolean;
}

export default function LeadForm({ fields = [], onSubmit, isSubmitting }: LeadFormProps) {
    const [formData, setFormData] = useState<Record<string, any>>({});

    // Default fields if none provided
    const formFields = fields.length > 0 ? fields : [
        { id: 'firstName', type: 'text', label: 'First Name', required: false, placeholder: 'Jane' },
        { id: 'email', type: 'email', label: 'Email Address', required: true, placeholder: 'jane@example.com' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (id: string, value: any) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    return (
        <div className="max-w-md mx-auto bg-white p-4 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                Almost there!
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Enter your details to see your personalized results.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {formFields.map((field) => (
                    <div key={field.id}>
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === 'checkbox' ? (
                            <div className="mt-2 flex items-center">
                                <input
                                    type="checkbox"
                                    id={field.id}
                                    checked={formData[field.id] || false}
                                    onChange={(e) => handleChange(field.id, e.target.checked)}
                                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    required={field.required}
                                />
                                <label htmlFor={field.id} className="ml-2 block text-sm text-gray-900">
                                    {field.placeholder || 'I agree'}
                                </label>
                            </div>
                        ) : (
                            <input
                                type={field.type}
                                id={field.id}
                                value={formData[field.id] || ''}
                                onChange={(e) => handleChange(field.id, e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base p-3 border min-h-[44px]"
                                placeholder={field.placeholder}
                                required={field.required}
                            />
                        )}
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                >
                    {isSubmitting ? 'Submitting...' : 'See My Results'}
                    {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5" />}
                </button>
            </form>
        </div>
    );
}
