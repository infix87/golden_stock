import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface StockProps {
    id: number;
    code: string;
    name: string;
    price: string;
    golden_cross_date: string;
    is_favorite?: boolean;
    onClick: (code: string) => void;
    onToggleFavorite: (e: React.MouseEvent, code: string) => void;
}

export default function StockCard({ code, name, price, golden_cross_date, is_favorite, onClick, onToggleFavorite }: StockProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all border ${is_favorite ? 'border-yellow-200 ring-1 ring-yellow-100' : 'border-gray-100'}`}
            onClick={() => onClick(code)}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{name}</h3>
                    <p className="text-sm text-gray-500">{code}</p>
                </div>
                <div className="flex gap-2 items-start">
                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md">
                        Golden Cross
                    </span>
                    <button
                        onClick={(e) => onToggleFavorite(e, code)}
                        className={`p-1 rounded-full transition-colors ${is_favorite ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
                    >
                        <Star className="w-5 h-5" fill={is_favorite ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>

            <div className="flex items-end justify-between">
                <div>
                    <p className="text-sm text-gray-400 mb-1">Current Price</p>
                    <p className="text-2xl font-bold text-gray-900">{price}</p>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className="text-xs text-gray-400">Detected Date</span>
                <span className="text-xs font-medium text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                    {golden_cross_date}
                </span>
            </div>
        </motion.div>
    );
}
