'use client';

import { useState } from 'react';
import { Users, Mail, Calendar, FileText, Eye, X, Phone, Globe, Database, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface LeadsTableProps {
    leads: any[];
}

export default function LeadsTable({ leads }: LeadsTableProps) {
    const [selectedLead, setSelectedLead] = useState<any>(null);

    return (
        <>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Name</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Email</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Quiz</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Captured At</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {leads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                                <Users className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-slate-900">{lead.name || 'Anonymous'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-slate-600">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            <span>{lead.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <FileText className="w-4 h-4 text-slate-400" />
                                            <span className="text-slate-900">{(lead.quiz as any)?.title || 'Unknown Quiz'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span>{new Date(lead.createdAt).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => setSelectedLead(lead)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {leads.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No leads found yet. Share your quizzes to start capturing leads!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Lead Details Modal */}
            <AnimatePresence>
                {selectedLead && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                            onClick={() => setSelectedLead(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 m-auto z-50 w-full max-w-4xl h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 font-heading">
                                        {selectedLead.name || 'Anonymous'}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Mail className="w-4 h-4" /> {selectedLead.email}
                                        </span>
                                        {selectedLead.phone && (
                                            <span className="flex items-center gap-1">
                                                <Phone className="w-4 h-4" /> {selectedLead.phone}
                                            </span>
                                        )}
                                        {selectedLead.country && (
                                            <span className="flex items-center gap-1">
                                                <Globe className="w-4 h-4" /> {selectedLead.country}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" /> {format(new Date(selectedLead.createdAt), 'PPpp')}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedLead(null)}
                                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-slate-500" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column: Quiz Answers */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
                                            <MessageSquare className="w-5 h-5 text-blue-600" />
                                            Quiz Answers
                                        </div>

                                        <div className="space-y-4">
                                            {selectedLead.quiz?.questions?.map((question: any, index: number) => {
                                                // Find answer in responses
                                                // Assuming responses[0] is the relevant one for now, or we merge all answers
                                                // Ideally we look at the response linked to this lead
                                                const response = selectedLead.responses?.[0]; // Taking the first response for now
                                                const answer = response?.answers?.[question.id];

                                                return (
                                                    <div key={question.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                                        <p className="text-sm font-medium text-slate-500 mb-2">
                                                            Question {index + 1}
                                                        </p>
                                                        <p className="font-medium text-slate-900 mb-2">
                                                            {question.text}
                                                        </p>
                                                        <div className="bg-white rounded-lg p-3 border border-slate-200 text-blue-600 font-medium">
                                                            {Array.isArray(answer) ? answer.join(', ') : (answer || 'No answer')}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {(!selectedLead.quiz?.questions || selectedLead.quiz.questions.length === 0) && (
                                                <p className="text-slate-500 italic">No questions found for this quiz.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column: Form Data & Metadata */}
                                    <div className="space-y-8">
                                        {/* Outcome */}
                                        <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                                            <h4 className="text-emerald-800 font-bold mb-1">Result / Outcome</h4>
                                            <p className="text-2xl font-bold text-emerald-600">
                                                {selectedLead.outcome || 'No Outcome'}
                                            </p>
                                            {selectedLead.score !== null && (
                                                <p className="text-emerald-700 mt-2 font-medium">
                                                    Score: {selectedLead.score}
                                                </p>
                                            )}
                                        </div>

                                        {/* Form Fields */}
                                        <div>
                                            <div className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                                                <Database className="w-5 h-5 text-indigo-600" />
                                                Form Data
                                            </div>
                                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                                <table className="w-full text-sm text-left">
                                                    <tbody className="divide-y divide-slate-100">
                                                        {Object.entries(selectedLead.metadata || {}).map(([key, value]) => (
                                                            <tr key={key}>
                                                                <td className="px-4 py-3 font-medium text-slate-600 bg-slate-50/50 w-1/3">
                                                                    {key}
                                                                </td>
                                                                <td className="px-4 py-3 text-slate-900">
                                                                    {String(value)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {(!selectedLead.metadata || Object.keys(selectedLead.metadata).length === 0) && (
                                                            <tr>
                                                                <td colSpan={2} className="px-4 py-3 text-slate-500 italic">
                                                                    No additional form data.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Hidden Data */}
                                        {selectedLead.hiddenData && Object.keys(selectedLead.hiddenData).length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                                                    <Eye className="w-5 h-5 text-amber-600" />
                                                    Hidden Fields
                                                </div>
                                                <div className="bg-amber-50 rounded-xl border border-amber-100 overflow-hidden">
                                                    <table className="w-full text-sm text-left">
                                                        <tbody className="divide-y divide-amber-100/50">
                                                            {Object.entries(selectedLead.hiddenData).map(([key, value]) => (
                                                                <tr key={key}>
                                                                    <td className="px-4 py-3 font-medium text-amber-800 w-1/3">
                                                                        {key}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-amber-900 font-mono text-xs">
                                                                        {String(value)}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
