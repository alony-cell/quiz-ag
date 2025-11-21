'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

export default function SettingsPage() {
    const [hubspotApiKey, setHubspotApiKey] = useState('');
    const [pixelId, setPixelId] = useState('');

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Saving settings:', { hubspotApiKey, pixelId });
        alert('Settings saved!');
    };

    return (
        <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Integrations & Settings</h2>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <form onSubmit={handleSave} className="p-6 space-y-6">

                    {/* HubSpot Integration */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">HubSpot Integration</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    HubSpot API Key
                                </label>
                                <input
                                    type="password"
                                    value={hubspotApiKey}
                                    onChange={(e) => setHubspotApiKey(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    placeholder="pat-na1-..."
                                />
                                <p className="mt-2 text-sm text-gray-500">
                                    Used to sync leads directly to your HubSpot CRM.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Tracking Pixels</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Facebook Pixel ID
                                </label>
                                <input
                                    type="text"
                                    value={pixelId}
                                    onChange={(e) => setPixelId(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    placeholder="1234567890"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            Save Settings
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
