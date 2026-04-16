"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { Screener } from "@/components/Screener";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white overflow-hidden selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen opacity-50" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/5 backdrop-blur-md bg-black/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">ISMA Fund</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#insights" className="hover:text-white transition-colors">Market Insights</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium hover:text-gray-300 transition-colors">Sign In</button>
            <button className="px-5 py-2.5 text-sm font-medium bg-white text-black rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Live NSE/BSE Market Data
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              Master the Indian Markets with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mt-2">
                AI-Powered Insights
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              The premier fundamental stock screener and insight platform. 
              Real-time analytics, institutional-grade tools, and AI-driven market intelligence 
              built specifically for NSE and BSE.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 text-base font-semibold bg-white text-black rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                Start Screening Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 text-base font-semibold bg-white/5 text-white border border-white/10 rounded-full hover:bg-white/10 transition-all">
                View Documentation
              </button>
            </div>
          </motion.div>
        </section>

        {/* Screener Component Section */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <Screener />
        </section>

        {/* Feature Highlights */}
        <section className="py-10 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="absolute -right-8 -bottom-8 opacity-20">
                <Zap className="w-40 h-40 text-purple-500" />
              </div>
              <div className="relative z-10 h-full flex flex-col">
                <h3 className="text-2xl font-semibold mb-4">AI Newsletters</h3>
                <p className="text-gray-400 flex-grow">
                  Daily AI-generated summaries of market movements, earnings reports, and breaking news for your watchlist.
                </p>
                <button className="mt-6 text-sm font-medium text-white hover:text-purple-400 transition-colors flex items-center gap-2">
                  Learn more <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <Shield className="w-10 h-10 text-pink-400 mb-6" />
              <h3 className="text-xl font-semibold mb-3">Institutional Grade</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Powered by enterprise data feeds and robust backend infrastructure for uncompromised reliability and speed.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-sm text-gray-500 relative z-10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <TrendingUp className="w-4 h-4" />
            <span className="font-semibold text-gray-300">ISMA Fund</span>
            <span>© 2024. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
