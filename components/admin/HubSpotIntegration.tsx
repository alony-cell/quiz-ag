'use client';

import { useEffect, useState } from 'react';
import { getIntegrations, saveIntegration } from '@/app/actions/integration';

import type { HubSpotIntegration, Integration } from '@/types';
interface Mapping {
    source: string;
    hubspot: string;
}

export default function HubSpotIntegration({ quizId }: { quizId: string }) {
    const [portalId, setPortalId] = useState('');
    const [formGuid, setFormGuid] = useState('');
    const [mappings, setMappings] = useState<Mapping[]>([]);
    const [integrationId, setIntegrationId] = useState<string | undefined>(undefined);
    const [isSaving, setIsSaving] = useState(false);

    // Load existing hubspot integration if present
    useEffect(() => {
        (async () => {
            const integrations = await getIntegrations(quizId);
            const hubspot = integrations.find((i: Integration) => i.type === 'hubspot');
            if (hubspot) {
                setIntegrationId(hubspot.id);
                if (hubspot.config) {
                    const cfg: HubSpotIntegration = hubspot.config;
                    setPortalId(cfg.portalId ?? '');
                    setFormGuid(cfg.formGuid ?? '');
                    setMappings(cfg.mappings ?? []);
                }
            }
        })();
    }, [quizId]);

    const addMapping = () => {
        setMappings([...mappings, { source: '', hubspot: '' }]);
    };

    const updateMapping = (index: number, field: keyof Mapping, value: string) => {
        const newMappings = [...mappings];
        newMappings[index] = { ...newMappings[index], [field]: value };
        setMappings(newMappings);
    };

    const removeMapping = (index: number) => {
        const newMappings = mappings.filter((_, i) => i !== index);
        setMappings(newMappings);
    };

    const handleSave = async () => {
        setIsSaving(true);
        const config: HubSpotIntegration = { portalId, formGuid, mappings };
        const result = await saveIntegration({
            id: integrationId,
            quizId,
            type: 'hubspot',
            config,
            isActive: true,
        });
        if (result.success && result.integration) {
            setIntegrationId(result.integration.id);
            alert('HubSpot integration saved');
        } else {
            alert('Failed to save HubSpot integration');
        }
        setIsSaving(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">HubSpot Integration</h2>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {isSaving ? 'Saving...' : 'Save Integration'}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Portal ID</label>
                        <input
                            type="text"
                            value={portalId}
                            onChange={e => setPortalId(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="e.g. 12345678"
                        />
                        <p className="mt-1 text-xs text-slate-500">Found in your HubSpot account settings</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Form GUID</label>
                        <input
                            type="text"
                            value={formGuid}
                            onChange={e => setFormGuid(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="e.g. a1b2c3d4-..."
                        />
                        <p className="mt-1 text-xs text-slate-500">Found in your HubSpot form settings</p>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-medium text-slate-900">Property Mappings</h3>
                            <p className="text-sm text-slate-500">Map your quiz data to HubSpot form fields</p>
                        </div>
                        <button
                            type="button"
                            onClick={addMapping}
                            className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            + Add Mapping
                        </button>
                    </div>

                    <div className="space-y-3">
                        {mappings.length === 0 ? (
                            <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                <p className="text-slate-500 text-sm">No mappings added yet.</p>
                                <button
                                    onClick={addMapping}
                                    className="mt-2 text-sm text-blue-600 hover:underline"
                                >
                                    Add your first mapping
                                </button>
                            </div>
                        ) : (
                            mappings.map((m, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 group">
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Source Field</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. email"
                                            value={m.source}
                                            onChange={e => updateMapping(idx, 'source', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="text-slate-400">→</div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-slate-500 mb-1">HubSpot Field Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. email"
                                            value={m.hubspot}
                                            onChange={e => updateMapping(idx, 'hubspot', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeMapping(idx)}
                                        className="mt-5 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove mapping"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
