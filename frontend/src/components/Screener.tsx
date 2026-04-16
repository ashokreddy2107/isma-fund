import { useState } from 'react';
import { BarChart3, Search, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface MarketData {
  fundamentals: {
    symbol: string;
    company_name: string;
    current_price: number;
    market_cap: number;
    pe_ratio: number | null;
    forward_pe: number | null;
    debt_to_equity: number | null;
    return_on_equity: number | null;
    eps: number | null;
    '52_week_high': number | null;
    '52_week_low': number | null;
  };
  news: Array<{
    title: string;
    publisher: string;
    link: string;
    published_at: number;
  }>;
  insights: {
    short_term: string;
    long_term: string;
  };
}

export function Screener() {
  const [ticker, setTicker] = useState('RELIANCE.NS');
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/market/${ticker.trim()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data. Please check the ticker symbol.');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while fetching data.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-indigo-400" /> Fundamental Screener
          </h2>
          <p className="text-gray-400">Enter a NSE/BSE ticker symbol (e.g., RELIANCE.NS, TCS.NS) to get AI-powered insights.</p>
        </div>

        <form onSubmit={handleSearch} className="flex w-full md:w-auto relative">
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Enter Ticker (e.g. RELIANCE.NS)"
            className="w-full md:w-64 bg-black/40 border border-white/10 rounded-l-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-r-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Analyze'}
            {!loading && <Search className="w-4 h-4" />}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 mb-8 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Fundamentals Card */}
          <div className="lg:col-span-2 bg-black/40 border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-white">{data.fundamentals.company_name}</h3>
                <span className="text-indigo-400 font-medium">{data.fundamentals.symbol}</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">₹{data.fundamentals.current_price?.toFixed(2) || 'N/A'}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="text-xs text-gray-400 mb-1">Market Cap</div>
                <div className="text-sm font-medium text-white">
                  {data.fundamentals.market_cap ? `₹${(data.fundamentals.market_cap / 1e7).toFixed(2)} Cr` : 'N/A'}
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="text-xs text-gray-400 mb-1">P/E Ratio</div>
                <div className="text-sm font-medium text-white">{data.fundamentals.pe_ratio?.toFixed(2) || 'N/A'}</div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="text-xs text-gray-400 mb-1">Forward P/E</div>
                <div className="text-sm font-medium text-white">{data.fundamentals.forward_pe?.toFixed(2) || 'N/A'}</div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="text-xs text-gray-400 mb-1">ROE</div>
                <div className="text-sm font-medium text-white">
                  {data.fundamentals.return_on_equity ? `${(data.fundamentals.return_on_equity * 100).toFixed(2)}%` : 'N/A'}
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="text-xs text-gray-400 mb-1">Debt to Equity</div>
                <div className="text-sm font-medium text-white">{data.fundamentals.debt_to_equity?.toFixed(2) || 'N/A'}</div>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="text-xs text-gray-400 mb-1">EPS</div>
                <div className="text-sm font-medium text-white">{data.fundamentals.eps?.toFixed(2) || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* AI Insights Card */}
          <div className="lg:col-span-1 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-2xl p-6 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
               AI Insights
            </h3>

            <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-indigo-300 mb-1">Short-Term</h4>
                <p className="text-sm text-gray-300 leading-relaxed">{data.insights.short_term}</p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="text-sm font-semibold text-purple-300 mb-1">Long-Term</h4>
                <p className="text-sm text-gray-300 leading-relaxed">{data.insights.long_term}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
