import { useEffect, useState } from 'react';
import axios from 'axios';
import StockCard from '../components/StockCard';
import { motion, AnimatePresence } from 'framer-motion';

// Types (should be centralized ideally)
interface Stock {
    id: number;
    code: string;
    name: string;
    price: string;
    golden_cross_date: string;
    is_favorite: boolean;
}

interface News {
    title: string;
    url: string;
    published_at: string;
    summary: string;
}

interface StockDetailData {
    stock: Stock;
    news: News[];
}

export default function HomePage() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [selectedStock, setSelectedStock] = useState<StockDetailData | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchStocks = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/stocks');
            setStocks(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await axios.post('http://localhost:8000/api/refresh');
            setTimeout(() => {
                fetchStocks();
                setRefreshing(false);
            }, 3000);
        } catch (e) {
            console.error(e);
            alert("Failed to scan market. check console for details.");
            setRefreshing(false);
        }
    };

    const handleStockClick = async (code: string) => {
        try {
            const res = await axios.get(`http://localhost:8000/api/stocks/${code}`);
            setSelectedStock(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleToggleFavorite = async (e: React.MouseEvent, code: string) => {
        e.stopPropagation();
        try {
            const res = await axios.post(`http://localhost:8000/api/stocks/${code}/favorite`);
            // Optimistic update locally
            setStocks(prev => prev.map(s => s.code === code ? { ...s, is_favorite: res.data.is_favorite } : s));

            // Also update modal if open
            if (selectedStock && selectedStock.stock.code === code) {
                setSelectedStock({
                    ...selectedStock,
                    stock: { ...selectedStock.stock, is_favorite: res.data.is_favorite }
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStocks();
    }, []);

    return (
        <div className="max-w-6xl mx-auto">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Golden Cross <span className="text-blue-600">Invest</span>
                    </h1>
                    <p className="text-gray-500 mt-2">Discover potential breakout stocks</p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className={`px-6 py-2.5 rounded-lg font-medium text-white shadow-md transition-all ${refreshing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                        }`}
                >
                    {refreshing ? 'Scanning...' : 'Scan Market'}
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stocks.map(stock => (
                    <StockCard
                        key={stock.id}
                        {...stock}
                        onClick={handleStockClick}
                        onToggleFavorite={handleToggleFavorite}
                    />
                ))}
                {stocks.length === 0 && !refreshing && (
                    <div className="col-span-full text-center py-20 text-gray-400">
                        No stocks detected yet. Click "Scan Market" to start.
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedStock && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => setSelectedStock(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">{selectedStock.stock.name}</h2>
                                        <p className="text-gray-500 text-sm">{selectedStock.stock.code}</p>
                                    </div>
                                    <button
                                        onClick={(e) => handleToggleFavorite(e, selectedStock.stock.code)}
                                        className={`text-2xl transition-colors ${selectedStock.stock.is_favorite ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
                                    >
                                        ★
                                    </button>
                                </div>
                                <button
                                    onClick={() => setSelectedStock(null)}
                                    className="text-gray-400 hover:text-gray-600 p-2"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                    Recent News
                                </h3>

                                <div className="space-y-4">
                                    {selectedStock.news.map((n, i) => (
                                        <a
                                            key={i}
                                            href={n.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block group p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                                        >
                                            <h4 className="font-semibold text-gray-800 group-hover:text-blue-700 leading-snug mb-2">
                                                {n.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 line-clamp-2">{n.summary}</p>
                                            <p className="text-xs text-gray-400 mt-2">{n.published_at}</p>
                                        </a>
                                    ))}
                                    {selectedStock.news.length === 0 && (
                                        <p className="text-gray-400 text-center py-4">No recent news found.</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
