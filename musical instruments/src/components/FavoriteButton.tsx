import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites.ts';

interface FavoriteButtonProps {
  slug: string;
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  slug,
  name,
  className = '',
  size = 'md',
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(slug);

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(slug);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={active ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
      title={active ? 'In Favorites' : 'Save to Favorites'}
      className={`rounded-full transition-all duration-200 cursor-pointer ${sizeClasses[size]} ${
        active
          ? 'bg-red-50 text-red-600 hover:bg-red-100 shadow-sm'
          : 'bg-white/80 backdrop-blur-sm text-stone-500 hover:text-red-500 hover:bg-white shadow-sm'
      } ${className}`}
    >
      <Heart
        className={`${iconSizes[size]} transition-transform active:scale-125 ${
          active ? 'fill-red-600 stroke-red-600' : 'stroke-current'
        }`}
      />
    </button>
  );
};
