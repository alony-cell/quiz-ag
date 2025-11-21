'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface LeadFormProps {
    onSubmit: (data: { email: string; firstName?: string }) => void;
}

export default function LeadForm({ onSubmit }: LeadFormProps) {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ email, firstName });
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
                Almost there!
            </h3>
            <p className="text-gray-600 mb-6">
                Enter your email to see your personalized results.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name (Optional)
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        placeholder="Jane"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        placeholder="jane@example.com"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    See My Results
                    <ArrowRight className="ml-2 w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
