'use client';

import { useState, useMemo } from 'react';
import { ArrowRight, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

// Priority countries: US, GB, CA, AU, NZ
const PRIORITY_COUNTRIES = ['US', 'GB', 'CA', 'AU', 'NZ'];

const COUNTRIES = [
    { code: 'US', name: 'United States', dial_code: '+1', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', dial_code: '+44', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', dial_code: '+1', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', dial_code: '+61', flag: '🇦🇺' },
    { code: 'NZ', name: 'New Zealand', dial_code: '+64', flag: '🇳🇿' },
    { code: 'IE', name: 'Ireland', dial_code: '+353', flag: '🇮🇪' },
    { code: 'DE', name: 'Germany', dial_code: '+49', flag: '🇩🇪' },
    { code: 'FR', name: 'France', dial_code: '+33', flag: '🇫🇷' },
    { code: 'ES', name: 'Spain', dial_code: '+34', flag: '🇪🇸' },
    { code: 'IT', name: 'Italy', dial_code: '+39', flag: '🇮🇹' },
    { code: 'PT', name: 'Portugal', dial_code: '+351', flag: '🇵🇹' },
    { code: 'NL', name: 'Netherlands', dial_code: '+31', flag: '🇳🇱' },
    { code: 'BE', name: 'Belgium', dial_code: '+32', flag: '🇧🇪' },
    { code: 'CH', name: 'Switzerland', dial_code: '+41', flag: '🇨🇭' },
    { code: 'AT', name: 'Austria', dial_code: '+43', flag: '🇦🇹' },
    { code: 'SE', name: 'Sweden', dial_code: '+46', flag: '🇸🇪' },
    { code: 'NO', name: 'Norway', dial_code: '+47', flag: '🇳🇴' },
    { code: 'DK', name: 'Denmark', dial_code: '+45', flag: '🇩🇰' },
    { code: 'FI', name: 'Finland', dial_code: '+358', flag: '🇫🇮' },
    { code: 'IL', name: 'Israel', dial_code: '+972', flag: '🇮🇱' },
    { code: 'IN', name: 'India', dial_code: '+91', flag: '🇮🇳' },
    { code: 'SG', name: 'Singapore', dial_code: '+65', flag: '🇸🇬' },
    { code: 'JP', name: 'Japan', dial_code: '+81', flag: '🇯🇵' },
    { code: 'KR', name: 'South Korea', dial_code: '+82', flag: '🇰🇷' },
    { code: 'CN', name: 'China', dial_code: '+86', flag: '🇨🇳' },
    { code: 'BR', name: 'Brazil', dial_code: '+55', flag: '🇧🇷' },
    { code: 'MX', name: 'Mexico', dial_code: '+52', flag: '🇲🇽' },
    { code: 'ZA', name: 'South Africa', dial_code: '+27', flag: '🇿🇦' },
    { code: 'AE', name: 'United Arab Emirates', dial_code: '+971', flag: '🇦🇪' },
].sort((a, b) => {
    const aPriority = PRIORITY_COUNTRIES.indexOf(a.code);
    const bPriority = PRIORITY_COUNTRIES.indexOf(b.code);

    // Both are priority countries
    if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;
    // Only a is priority
    if (aPriority !== -1) return -1;
    // Only b is priority
    if (bPriority !== -1) return 1;

    // Neither is priority, sort by name
    return a.name.localeCompare(b.name);
});

export default function LeadForm({ fields = [], onSubmit, isSubmitting }: LeadFormProps) {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [countryCode, setCountryCode] = useState('US');
    const [isCountryOpen, setIsCountryOpen] = useState(false);

    // Default fields if none provided
    const formFields = fields.length > 0 ? fields : [
        { id: 'firstName', type: 'text', label: 'First Name', required: false, placeholder: 'Jane' },
        { id: 'email', type: 'email', label: 'Email Address', required: true, placeholder: 'jane@example.com' },
    ];

    const selectedCountry = useMemo(() =>
        COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0],
        [countryCode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Combine phone with country code if phone field exists
        const data = { ...formData };
        if (fields.some(f => f.type === 'phone')) {
            data.country = countryCode;
            // Optionally format phone number here
        }
        onSubmit(data);
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
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>

                        {field.type === 'phone' ? (
                            <div className="relative">
                                <div className="flex rounded-lg shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => setIsCountryOpen(!isCountryOpen)}
                                        className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[44px]"
                                    >
                                        <span className="mr-2 text-lg">{selectedCountry.flag}</span>
                                        <span className="mr-1">{selectedCountry.dial_code}</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="tel"
                                        id={field.id}
                                        value={formData[field.id] || ''}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        className="flex-1 block w-full min-w-0 rounded-none rounded-r-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3 border min-h-[44px]"
                                        placeholder={field.placeholder || 'Phone number'}
                                        required={field.required}
                                    />
                                </div>

                                {/* Country Dropdown */}
                                <AnimatePresence>
                                    {isCountryOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setIsCountryOpen(false)}
                                            />
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute z-20 mt-1 w-64 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                                            >
                                                {COUNTRIES.map((country) => (
                                                    <button
                                                        key={country.code}
                                                        type="button"
                                                        className={`w-full text-left cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 flex items-center ${country.code === countryCode ? 'bg-blue-50' : ''}`}
                                                        onClick={() => {
                                                            setCountryCode(country.code);
                                                            setIsCountryOpen(false);
                                                        }}
                                                    >
                                                        <span className="text-xl mr-3">{country.flag}</span>
                                                        <span className={`block truncate ${country.code === countryCode ? 'font-semibold' : 'font-normal'}`}>
                                                            {country.name}
                                                        </span>
                                                        <span className="ml-auto text-gray-400 text-xs mr-2">{country.dial_code}</span>
                                                        {country.code === countryCode && (
                                                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                                                                <Check className="h-4 w-4" />
                                                            </span>
                                                        )}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : field.type === 'checkbox' ? (
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
