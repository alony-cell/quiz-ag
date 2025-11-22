'use client';

import { useState } from 'react';
import { saveIntegration, deleteIntegration } from '@/app/actions/integration';
import { Loader2, Plus, Trash2, Check, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface IntegrationsManagerProps {
    quizId: string;
    initialIntegrations: any[];
}

export default function IntegrationsManager({ quizId, initialIntegrations }: IntegrationsManagerProps) {
    const router = useRouter();
    const [integrations, setIntegrations] = useState(initialIntegrations);
    const [isSaving, setIsSaving] = useState(false);
    const [activeType, setActiveType] = useState<string | null>(null);
    const [config, setConfig] = useState<any>({});

    const handleAdd = (type: string) => {
        setActiveType(type);
        setConfig({});
    };

    const handleSave = async () => {
        setIsSaving(true);
        const result = await saveIntegration({
            quizId,
            type: activeType!,
            config,
            isActive: true,
        });
        setIsSaving(false);

        if (result.success) {
            setActiveType(null);
            setConfig({});
            router.refresh();
            // Optimistic update
            setIntegrations([...integrations, result.integration]);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to remove this integration?')) return;
        await deleteIntegration(id, quizId);
        setIntegrations(integrations.filter(i => i.id !== id));
        router.refresh();
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Available Integrations */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Available Integrations</h3>

                    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 font-bold">
                                HS
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">HubSpot</p>
                                <p className="text-xs text-slate-500">Sync leads to CRM</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleAdd('hubspot')}
                            className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            Connect
                        </button>
                    </div>

                    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                                FB
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">Facebook Pixel</p>
                                <p className="text-xs text-slate-500">Track conversions</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleAdd('facebook_pixel')}
                            className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            Connect
                        </button>
                    </div>
                </div>

                {/* Active Integrations */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Active Connections</h3>
                    {integrations.length === 0 && (
                        <p className="text-sm text-slate-500 italic">No active integrations.</p>
                    )}
                    {integrations.map((integration) => (
                        <div key={integration.id} className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl shadow-sm flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-emerald-600">
                                    <Check className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-medium text-emerald-900">
                                        {integration.type === 'hubspot' ? 'HubSpot' : 'Facebook Pixel'}
                                    </p>
                                    <p className="text-xs text-emerald-700">Active</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(integration.id)}
                                className="p-2 text-emerald-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Configuration Modal/Form */}
            {activeType && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">
                            Configure {activeType === 'hubspot' ? 'HubSpot' : 'Facebook Pixel'}
                        </h3>

                        <div className="space-y-4">
                            {activeType === 'hubspot' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">API Key / Access Token</label>
                                    <input
                                        type="text"
                                        value={config.apiKey || ''}
                                        onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="pat-na1-..."
                                    />
                                </div>
                            )}
                            {activeType === 'facebook_pixel' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Pixel ID</label>
                                    <input
                                        type="text"
                                        value={config.pixelId || ''}
                                        onChange={(e) => setConfig({ ...config, pixelId: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="1234567890"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setActiveType(null)}
                                className="px-4 py-2 text-slate-600 hover:text-slate-900"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                            >
                                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
