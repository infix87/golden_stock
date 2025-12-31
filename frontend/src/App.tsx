import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import { Activity, Star } from 'lucide-react';

function NavBar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-6 py-3 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="text-blue-600" />
            StockHelper
          </Link>
          <div className="hidden md:flex gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              Market Scan
            </Link>
            <Link
              to="/favorites"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/favorites' ? 'bg-yellow-50 text-yellow-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              Favorites
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
      <NavBar />
      {children}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
