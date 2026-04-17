"use client";

import { useEffect, useState } from 'react';
import { Mail, RefreshCw, AlertCircle, TrendingUp, TrendingDown, BookOpen, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StockInsight {
  ticker: string;
  name: string;
  price: number | null;
  pe: number | null;
  short_term: string;
  long_term: string;
  news: Array<{ title: string; link: string }>;
  status: "success" | "error";
  error?: string;
}

interface NewsletterData {
  generated_at: string;
  stocks: StockInsight[];
  content?: string; // fallback
}

export function NewsletterFeed() {
  const [data, setData] = useState<NewsletterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNewsletter = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/api/market/newsletter/latest`);
      if (!response.ok) {
        throw new Error('Failed to fetch latest newsletter.');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletter();
  }, []);

  const formatDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-8 mt-12 rounded-[2rem] bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
      {/* Abstract Background element */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-3">
             Institutional Grade
          </div>
          <h2 className="text-4xl font-bold text-white flex items-center gap-3 tracking-tight">
            <Mail className="w-9 h-9 text-indigo-400" /> Daily Alpha Insights
          </h2>
          {data?.generated_at && (
            <p className="text-gray-400 mt-2 flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4 text-gray-500" /> 
              Generated on {formatDate(data.generated_at)}
            </p>
          )}
        </div>
        
        <button
          onClick={fetchNewsletter}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 group shadow-lg"
        >
          <RefreshCw className={`w-4 h-4 text-indigo-400 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          {loading ? 'Refreshing...' : 'Refresh Feed'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-400 flex flex-col items-center text-center gap-3 my-12"
          >
            <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
            <div className="text-lg font-bold">Unable to sync feed</div>
            <p className="text-sm text-red-400/70 max-w-md">{error}</p>
          </motion.div>
        ) : loading && !data ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12"
          >
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
            ))}
          </motion.div>
        ) : data?.stocks && data.stocks.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
          >
            {data.stocks.map((stock, idx) => (
              <motion.div
                key={stock.ticker}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group p-6 rounded-[1.5rem] bg-black/40 border border-white/10 hover:border-indigo-500/30 transition-all hover:shadow-[0_0_30px_rgba(79,70,229,0.1)] flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="max-w-[70%]">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors truncate">{stock.name}</h3>
                    <p className="text-xs font-mono text-gray-500">{stock.ticker}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-white">
                      {stock.price ? `₹${stock.price.toLocaleString('en-IN')}` : 'N/A'}
                    </div>
                    {stock.pe && <div className="text-[10px] text-gray-400 font-medium">P/E: {stock.pe}</div>}
                  </div>
                </div>

                {stock.status === 'success' ? (
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="space-y-1.5 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-indigo-400">
                        <TrendingUp className="w-3 h-3" /> Momentum Analytics
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed italic">"{stock.short_term}"</p>
                    </div>

                    <div className="space-y-1.5 p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-purple-400">
                        <BookOpen className="w-3 h-3" /> Fundamental Outlook
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{stock.long_term}</p>
                    </div>
                    
                    {stock.news && stock.news.length > 0 && (
                      <div className="pt-2">
                        <div className="text-[10px] font-bold text-gray-500 mb-2 px-1">Recent Catalysts</div>
                        <ul className="space-y-1.5">
                          {stock.news.map((item, i) => (
                            <li key={i} className="text-[10px] text-indigo-300/80 hover:text-indigo-300 truncate">
                              <a href={item.link} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-indigo-500" />
                                {item.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-4 rounded-xl bg-white/5 border border-white/5 text-center text-xs text-gray-500 italic">
                    Offline analysis: {stock.error || 'Market data gap'}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="py-20 text-center text-gray-500 italic font-medium">
            Waiting for market insights to be generated...
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
