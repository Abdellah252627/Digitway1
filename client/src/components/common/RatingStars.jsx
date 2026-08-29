import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 5, maxRating = 5, size = 'sm', interactive = false, onRatingChange = () => {} }) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const currentSize = sizeClasses[size] || sizeClasses.sm;

  return (
    <div className="inline-flex items-center gap-1" role={interactive ? 'radiogroup' : 'img'} aria-label={`${rating} out of ${maxRating} stars`}>
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= rating;

        if (interactive) {
          return (
            <button
              key={starValue}
              type="button"
              onClick={() => onRatingChange(starValue)}
              className="focus:outline-none transition-transform hover:scale-110 p-0.5"
              aria-label={`${starValue} Stars`}
            >
              <Star
                className={`${currentSize} ${
                  isFilled
                    ? 'fill-brand-accent text-brand-accent drop-shadow-sm'
                    : 'text-surface-muted hover:text-brand-accent/50'
                } transition-colors`}
              />
            </button>
          );
        }

        return (
          <Star
            key={starValue}
            className={`${currentSize} ${
              isFilled ? 'fill-brand-accent text-brand-accent' : 'text-surface-muted fill-transparent'
            }`}
          />
        );
      })}
    </div>
  );
}
