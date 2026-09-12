import { MemoryRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { Footer } from './components/Footer.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { ExplorePage } from './pages/ExplorePage.tsx';
import { InstrumentDetailPage } from './pages/InstrumentDetailPage.tsx';
import { MapPage } from './pages/MapPage.tsx';
import { ComparePage } from './pages/ComparePage.tsx';
import { QuizPage } from './pages/QuizPage.tsx';
import { FavoritesPage } from './pages/FavoritesPage.tsx';
import { GamesPage } from './pages/GamesPage.tsx';
import { VillagePage } from './pages/VillagePage.tsx';
import { LearnToPlayPage } from './pages/LearnToPlayPage.tsx';
import { ArrowLeft, Home } from 'lucide-react';
import './index.css';

function SubpageHeaderReturn() {
  const location = useLocation();
  if (location.pathname === '/' || location.pathname === '/village') {
    // Village has its own built-in exit button and home is the front page
    return null;
  }
  return (
    <div className="fixed top-4 left-4 z-40">
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/80 hover:bg-stone-900 text-amber-100 hover:text-white backdrop-blur-md border border-amber-500/30 text-xs font-semibold shadow-lg transition-all active:scale-95 group"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
        <Home className="w-3.5 h-3.5 text-amber-300" />
        <span>Return to Music Home</span>
      </Link>
    </div>
  );
}

function ConditionalFooter() {
  const location = useLocation();
  if (location.pathname === '/' || location.pathname === '/village') {
    return null;
  }
  return <Footer />;
}

export default function App() {
  return (
    <MemoryRouter initialEntries={['/']}>
      <div className="music-experience min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900 font-sans selection:bg-amber-200 selection:text-amber-950">
        <SubpageHeaderReturn />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/village" element={<VillagePage />} />
            <Route path="/instruments" element={<ExplorePage />} />
            <Route path="/instruments/:id" element={<InstrumentDetailPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/games/:gameId" element={<GamesPage />} />
            <Route path="/learn" element={<LearnToPlayPage />} />
            <Route path="/learn-to-play" element={<Navigate to="/learn" replace />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <ConditionalFooter />
      </div>
    </MemoryRouter>
  );
}
