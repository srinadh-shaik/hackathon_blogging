"use client";

import React, { useState } from 'react';
import { Menu, ArrowRight, Terminal, Database, FileText, Globe, Users } from 'lucide-react';

interface ResponsiveHeroBannerProps {
    onGetStarted?: () => void;
}

const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
    onGetStarted
}) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { label: "Overview", href: "#", isActive: true },
        { label: "Public Logs", href: "#" },
        { label: "Team Spaces", href: "#" }
    ];

    const partnerIcons = [Terminal, Database, FileText, Globe, Users];

    return (
        <section className="w-full isolate min-h-screen overflow-hidden relative bg-slate-900">
            <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=3840&auto=format&fit=crop"
                alt="Hackathon Coding Background"
                className="w-full h-full object-cover absolute top-0 right-0 bottom-0 left-0 opacity-20 mix-blend-overlay"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/90 to-slate-950" />

            <header className="z-10 xl:top-4 relative">
                <div className="mx-6">
                    <div className="flex items-center justify-between pt-4">
                        <div className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
                            <Terminal className="text-blue-500" /> HackLogger
                        </div>

                        <nav className="hidden md:flex items-center gap-2">
                            <div className="flex items-center gap-1 rounded-full bg-white/5 px-1 py-1 ring-1 ring-white/10 backdrop-blur">
                                {navLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.href}
                                        className={`px-4 py-2 text-sm font-medium hover:text-white font-sans transition-colors ${link.isActive ? 'text-white/90' : 'text-white/60'}`}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                <button
                                    onClick={onGetStarted}
                                    className="ml-2 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-900 hover:bg-blue-50 transition-colors"
                                >
                                    Sign In <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </nav>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur"
                        >
                            <Menu className="h-5 w-5 text-white/90" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="z-10 relative">
                <div className="sm:pt-28 md:pt-32 lg:pt-40 max-w-7xl mx-auto pt-28 px-6 pb-16">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-blue-500/10 px-3 py-2 ring-1 ring-blue-500/30 backdrop-blur animate-fade-slide-in-1">
                            <span className="inline-flex items-center text-xs font-black text-blue-900 bg-blue-400 rounded-full py-1 px-3 uppercase tracking-widest">
                                Workspace
                            </span>
                            <span className="text-sm font-medium text-blue-100 pr-2">
                                Built exclusively for hackathon teams
                            </span>
                        </div>

                        <h1 className="sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1] text-5xl text-white tracking-tighter font-black animate-fade-slide-in-2">
                            Document the Build.
                            <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Prove the Concept.</span>
                        </h1>

                        <p className="sm:text-xl animate-fade-slide-in-3 text-lg text-slate-300 max-w-3xl mt-8 mx-auto leading-relaxed">
                            Stop losing progress in chaotic chat channels. Whether you are building complex AI/ML architectures or transforming a weekend hack into a viable business idea, this platform keeps your team aligned. Log your algorithms, share crucial research links, and publish a clean timeline to show judges exactly how you built it.
                        </p>

                        <div className="flex flex-col sm:flex-row sm:gap-4 mt-12 gap-4 items-center justify-center animate-fade-slide-in-4">
                            <button
                                onClick={onGetStarted}
                                className="inline-flex items-center gap-2 hover:bg-blue-500 text-base font-bold text-white bg-blue-600 rounded-full py-4 px-8 shadow-xl shadow-blue-900/20 transition-all transform hover:scale-105 w-full sm:w-auto justify-center"
                            >
                                Create Your Team Log <ArrowRight className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={onGetStarted}
                                className="inline-flex items-center gap-2 rounded-full bg-white/5 px-8 py-4 text-base font-bold text-white ring-1 ring-white/10 hover:bg-white/10 transition-colors w-full sm:w-auto justify-center"
                            >
                                <Globe className="w-5 h-5" /> View Public Logs
                            </button>
                        </div>
                    </div>

                    <div className="mx-auto mt-24 max-w-5xl border-t border-white/10 pt-10">
                        <p className="animate-fade-slide-in-1 text-sm text-slate-400 font-medium text-center uppercase tracking-widest mb-8">
                            Everything you need to ship
                        </p>
                        <div className="flex flex-wrap animate-fade-slide-in-2 text-slate-500 items-center justify-center gap-8 md:gap-16">
                            {partnerIcons.map((Icon, index) => (
                                <Icon key={index} className="w-10 h-10 opacity-50 hover:opacity-100 hover:text-white transition-all cursor-pointer" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResponsiveHeroBanner;