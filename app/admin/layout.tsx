'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Users, Settings, LogOut } from 'lucide-react';
import clsx from 'clsx';

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

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-2xl font-bold font-heading bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Quiz Platform
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Admin Workspace</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={clsx(
                                    'flex items-center px-4 py-3 rounded-xl transition-all duration-200 group',
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                )}
                            >
                                <item.icon className={clsx('w-5 h-5 mr-3 transition-colors', isActive ? 'text-white' : 'text-slate-500 group-hover:text-white')} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button className="flex items-center w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                        <LogOut className="w-5 h-5 mr-3" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-50">
                <div className="max-w-7xl mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
