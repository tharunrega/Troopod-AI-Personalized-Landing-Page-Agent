'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Link as LinkIcon, Image as ImageIcon, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [adCreative, setAdCreative] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultHtml, setResultHtml] = useState(null); // Keep name for backwards compatibility, but we will store a URL
  const [error, setError] = useState('');
  const [view, setView] = useState('split'); // 'split' or 'full'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url || !adCreative) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Basic URL validation
      const targetUrl = url.startsWith('http') ? url : `https://${url}`;
      
      // Instead of fetching the HTML and using srcDoc (which breaks Next.js router APIs because origin is 'null'),
      // We directly pass our proxy endpoint to the iframe's src!
      const proxyUrl = `/api/personalize?url=${encodeURIComponent(targetUrl)}&adCreative=${encodeURIComponent(adCreative)}`;
      
      setResultHtml(proxyUrl);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setTimeout(() => setLoading(false), 800); // slight delay for better UX
    }
  };

  const handleReset = () => {
    setResultHtml(null);
    setUrl('');
    setAdCreative('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-blue-500/30">
      {/* Decorative background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center">
        {!resultHtml ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl mt-12"
          >
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                AI Landing Page Personalizer
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Transform any existing landing page instantly. Input your ad creative and the target URL, and our AI agent optimizing it for higher conversions.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Landing Page URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <LinkIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com/landing-page"
                      required
                      className="block w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex justify-between">
                    <span>Ad Creative Context</span>
                    <span className="text-xs text-blue-400">Be descriptive for better results</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                      <ImageIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <textarea
                      value={adCreative}
                      onChange={(e) => setAdCreative(e.target.value)}
                      placeholder="Describe your ad creative, target audience, and the main offer... (e.g. 'Targeting CTOs looking for cloud cost reduction tools. 50% off first month.')"
                      required
                      rows={5}
                      className="block w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative group overflow-hidden rounded-xl p-[1px]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-70 group-hover:opacity-100 transition duration-300"></span>
                  <div className="relative flex items-center justify-center bg-black/50 backdrop-blur-sm group-hover:bg-black/20 text-white font-medium py-4 px-8 rounded-xl transition duration-300">
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-400" />
                        Analyzing & Personalizing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-5 w-5" />
                        Generate AI Personalized Page
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>
            
            <div className="mt-8 text-center text-sm text-gray-500">
              Note: This is a simulated demo for the Troopod PM Assignment.
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-[85vh] flex flex-col"
          >
            <div className="flex justify-between items-center mb-6 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center hidden sm:flex">
                  <Wand2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Personalization Complete</h2>
                  <p className="text-xs text-gray-400 font-mono truncate max-w-[200px] sm:max-w-md">{url}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-1 rounded-lg flex text-sm">
                  <button 
                    onClick={() => setView('split')}
                    className={`px-4 py-1.5 rounded-md transition ${view === 'split' ? 'bg-white/20 text-white font-medium' : 'text-gray-400 hover:text-white'}`}
                  >
                    Split View
                  </button>
                  <button 
                    onClick={() => setView('full')}
                    className={`px-4 py-1.5 rounded-md transition ${view === 'full' ? 'bg-white/20 text-white font-medium' : 'text-gray-400 hover:text-white'}`}
                  >
                    Full Preview
                  </button>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Start Over"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>
            </div>

            {view === 'split' ? (
              <div className="flex-1 flex flex-col md:flex-row gap-6 h-full overflow-hidden">
                <div className="flex-1 flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="bg-black/50 py-3 px-4 border-b border-white/10 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-300">Original Page</span>
                    <span className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold bg-gray-500/20 text-gray-400 rounded">Baseline</span>
                  </div>
                  <div className="flex-1 bg-white relative">
                    <iframe src={url.startsWith('http') ? url : `https://${url}`} className="w-full h-full border-0 absolute inset-0" title="Original" />
                  </div>
                </div>

                <div className="hidden md:flex items-center justify-center">
                  <ArrowRight className="h-8 w-8 text-blue-500/50" />
                </div>

                <div className="flex-1 flex flex-col bg-white/5 border border-blue-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20 relative">
                  <div className="absolute inset-0 bg-blue-500/5 pointer-events-none z-10" />
                  <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 py-3 px-4 border-b border-blue-500/30 flex justify-between items-center">
                    <span className="text-sm font-medium text-white flex items-center">
                      <Wand2 className="h-4 w-4 mr-2 text-blue-400" />
                      AI Personalized
                    </span>
                    <span className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold bg-blue-500/20 text-blue-300 rounded">Optimized</span>
                  </div>
                  <div className="flex-1 bg-white relative">
                    <iframe src={resultHtml} className="w-full h-full border-0 absolute inset-0" title="Personalized Result" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col bg-white/5 border border-blue-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20 relative">
                <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 py-3 px-4 border-b border-blue-500/30 flex justify-between items-center">
                  <span className="text-sm font-medium text-white flex items-center">
                    <Wand2 className="h-4 w-4 mr-2 text-blue-400" />
                    AI Personalized (Full View)
                  </span>
                  <span className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold bg-blue-500/20 text-blue-300 rounded">Optimized</span>
                </div>
                <div className="flex-1 bg-white relative">
                  <iframe src={resultHtml} className="w-full h-full border-0 absolute inset-0" title="Personalized Result" />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
