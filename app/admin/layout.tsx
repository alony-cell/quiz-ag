'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Users, Settings, LogOut, Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Quizzes', href: '/admin/quizzes', icon: FileText },
    { name: 'Leads', href: '/admin/leads', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    'fixed md:static inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out',
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                )}
            >
                <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold font-heading bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            Quiz Platform
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">Admin Workspace</p>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
                        aria-label="Close sidebar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 p-3 sm:p-4 space-y-2 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={clsx(
                                    'flex items-center px-4 py-3 rounded-xl transition-all duration-200 group min-h-[44px]',
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                )}
                            >
                                <item.icon className={clsx('w-5 h-5 mr-3 transition-colors flex-shrink-0', isActive ? 'text-white' : 'text-slate-500 group-hover:text-white')} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 sm:p-4 border-t border-slate-800">
                    <button className="flex items-center w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all min-h-[44px]">
                        <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-50 w-full">
                {/* Mobile Header */}
                <div className="md:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        aria-label="Open sidebar"
                    >
                        <Menu className="w-6 h-6 text-slate-700" />
                    </button>
                    <h2 className="text-lg font-bold text-slate-900">Quiz Platform</h2>
                    <div className="w-10" /> {/* Spacer for centering */}
                </div>

                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
