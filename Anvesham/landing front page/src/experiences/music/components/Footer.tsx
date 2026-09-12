import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass, Music, Map, HelpCircle, Sparkles, Gamepad2, Trophy } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-amber-900/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center text-white font-serif font-black text-xl text-amber-200">
                IX
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-amber-100 block leading-none">
                  Itihaas<span className="text-amber-400">X</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-widest text-amber-400 block mt-1">
                  Digital Museum of Indian Musical Heritage
                </span>
              </div>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed max-w-md">
              ItihaasX preserves, documents, and celebrates the rich acoustic biodiversity of India’s traditional musical instruments—connecting ancient craft, folk storytelling, classical discipline, and sacred sounds for students and culture enthusiasts globally.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400/90 pt-1">
              <Sparkles className="w-4 h-4" />
              <span>Celebrating Natya Shastra traditions: Tata, Sushira, Avanaddha & Ghana Vadya</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-serif text-base font-bold text-amber-200 mb-4 tracking-wide uppercase text-xs">
              Explore Heritage
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/village" className="hover:text-amber-300 transition-colors flex items-center gap-2 font-semibold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>3D Heritage Village</span>
                </Link>
              </li>
              <li>
                <Link to="/games" className="hover:text-amber-300 transition-colors flex items-center gap-2 font-semibold text-amber-300">
                  <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Games</span>
                </Link>
              </li>
              <li>
                <Link to="/learn" className="hover:text-amber-300 transition-colors flex items-center gap-2 font-semibold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Learn To Play</span>
                </Link>
              </li>
              <li>
                <Link to="/instruments" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <Music className="w-3.5 h-3.5 text-amber-600" />
                  <span>All Instruments</span>
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <Map className="w-3.5 h-3.5 text-amber-600" />
                  <span>Interactive Sound Map</span>
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Culture Knowledge Quiz</span>
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-amber-600" />
                  <span>Compare Instruments</span>
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-amber-600" />
                  <span>Saved Favorites</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Cultural Traditions */}
          <div>
            <h4 className="font-serif text-base font-bold text-amber-200 mb-4 tracking-wide uppercase text-xs">
              Musical Streams
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                'Hindustani Classical',
                'Carnatic Classical',
                'Baul & Sufi Folk',
                'Rajasthani Manganiyar',
                'Punjabi Folk & Bhangra',
                'Kerala Temple Sopanam',
                'Manipuri Sankirtana',
                'Assamese Bihu Folk',
                'Dhrupad & Haveli',
                'Himalayan Jagar',
              ].map((trad) => (
                <Link
                  key={trad}
                  to={`/instruments?search=${encodeURIComponent(trad.split(' ')[0])}`}
                  className="px-2.5 py-1 rounded-md bg-stone-900 hover:bg-amber-950 text-stone-300 hover:text-amber-200 text-xs border border-stone-800 transition-colors"
                >
                  {trad}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} ItihaasX. Preserving Indian Musical Heritage.
          </p>
          <p className="flex items-center gap-1">
            Crafted for cultural education and student exploration
          </p>
        </div>
      </div>
    </footer>
  );
};
