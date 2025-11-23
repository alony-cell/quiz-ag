'use client';

import { useEffect, useState } from 'react';
import { getIntegrations, saveIntegration } from '@/app/actions/integration';
import type { FacebookIntegration, Integration } from '@/types';
import { Info } from 'lucide-react';

export default function FacebookIntegration({ quizId }: { quizId: string }) {
    const [pixelId, setPixelId] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [testEventCode, setTestEventCode] = useState('');
    const [events, setEvents] = useState({
        lead: true,
        complete: true,
    });
    const [integrationId, setIntegrationId] = useState<string | undefined>(undefined);
    const [isSaving, setIsSaving] = useState(false);

    // Load existing facebook integration if present
    useEffect(() => {
        (async () => {
            const integrations = await getIntegrations(quizId);
            const fb = integrations.find((i: Integration) => i.type === 'facebook_pixel');
            if (fb) {
                setIntegrationId(fb.id);
                if (fb.config) {
                    const cfg = fb.config as FacebookIntegration;
                    setPixelId(cfg.pixelId ?? '');
                    setAccessToken(cfg.accessToken ?? '');
                    setTestEventCode(cfg.testEventCode ?? '');
                    setEvents(cfg.events ?? { lead: true, complete: true });
                }
            }
        })();
    }, [quizId]);

    const handleSave = async () => {
        setIsSaving(true);
        const config: FacebookIntegration = {
            pixelId,
            accessToken,
            testEventCode,
            events
        };
        const result = await saveIntegration({
            id: integrationId,
            quizId,
            type: 'facebook_pixel',
            config,
            isActive: true,
        });
        if (result.success && result.integration) {
            setIntegrationId(result.integration.id);
            alert('Facebook integration saved');
        } else {
            alert('Failed to save Facebook integration');
        }
        setIsSaving(false);
    };

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Facebook CAPI Integration</h2>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {isSaving ? 'Saving...' : 'Save Integration'}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-8">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Pixel ID</label>
                        <input
                            type="text"
                            value={pixelId}
                            onChange={e => setPixelId(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="e.g. 1234567890"
                        />
                        <p className="mt-1 text-xs text-slate-500">Found in Events Manager &gt; Data Sources &gt; Settings</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Access Token</label>
                        <input
                            type="password"
                            value={accessToken}
                            onChange={e => setAccessToken(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="EAAG..."
                        />
                        <p className="mt-1 text-xs text-slate-500">Generate from Events Manager &gt; Data Sources &gt; Settings &gt; Conversions API</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Test Event Code (Optional)</label>
                        <input
                            type="text"
                            value={testEventCode}
                            onChange={e => setTestEventCode(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="TEST12345"
                        />
                        <p className="mt-1 text-xs text-slate-500">Use this to verify events in the "Test Events" tab</p>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-8">
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Event Configuration</h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <input
                                type="checkbox"
                                id="event-lead"
                                checked={events.lead}
                                onChange={e => setEvents({ ...events, lead: e.target.checked })}
                                className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                            />
                            <div>
                                <label htmlFor="event-lead" className="block text-sm font-medium text-slate-900">
                                    Send "Lead" Event
                                </label>
                                <p className="text-sm text-slate-500">
                                    Triggered when a user submits the lead capture form.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <input
                                type="checkbox"
                                id="event-complete"
                                checked={events.complete}
                                onChange={e => setEvents({ ...events, complete: e.target.checked })}
                                className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                            />
                            <div>
                                <label htmlFor="event-complete" className="block text-sm font-medium text-slate-900">
                                    Send "CompleteRegistration" Event
                                </label>
                                <p className="text-sm text-slate-500">
                                    Triggered when a user completes the quiz and sees the outcome/thank you page.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
