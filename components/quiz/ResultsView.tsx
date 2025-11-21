'use client';

import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ResultsView() {
    return (
        <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8 flex justify-center">
                <div className="rounded-full bg-green-100 p-4">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                You are a Growth Marketer!
            </h2>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                You focus on rapid experimentation and data-driven decision making.
                Your strength lies in finding scalable channels and optimizing conversion rates.
            </p>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8 text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Next Steps:</h3>
                <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        Focus on automating your high-performing campaigns.
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        Experiment with new channels like TikTok or LinkedIn Ads.
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2">•</span>
                        Invest in better analytics tools to track full-funnel attribution.
                    </li>
                </ul>
            </div>

            <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
            >
                Back to Home
            </Link>
        </div>
    );
}
