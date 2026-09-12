import React from 'react';
import { Music, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionLink?: string;
  onActionClick?: () => void;
  icon?: 'music' | 'search';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Instruments Found',
  description = 'Try clearing your filters or searching for different regions, instruments, or traditions.',
  actionText = 'Explore All Instruments',
  actionLink = '/instruments',
  onActionClick,
  icon = 'music',
}) => {
  return (
    <div className="text-center py-16 px-4 max-w-md mx-auto">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shadow-inner">
        {icon === 'search' ? (
          <Search className="w-8 h-8" />
        ) : (
          <Music className="w-8 h-8" />
        )}
      </div>
      <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">{title}</h3>
      <p className="text-stone-600 text-sm mb-6 leading-relaxed">{description}</p>
      {onActionClick ? (
        <button
          onClick={onActionClick}
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-amber-800 hover:bg-amber-900 text-white text-sm font-medium transition-colors shadow-sm cursor-pointer"
        >
          {actionText}
        </button>
      ) : (
        <Link
          to={actionLink}
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-amber-800 hover:bg-amber-900 text-white text-sm font-medium transition-colors shadow-sm"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};
