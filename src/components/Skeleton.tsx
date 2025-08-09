import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  animate?: boolean;
}

export const Skeleton = ({
  className = '',
  width,
  height,
  rounded = true,
  animate = true
}: SkeletonProps) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-600';
  const animationClasses = animate ? 'animate-pulse' : '';
  const roundedClasses = rounded ? 'rounded' : '';
  
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div 
      className={`${baseClasses} ${animationClasses} ${roundedClasses} ${className}`}
      style={style}
    />
  );
};

// Predefined skeleton variants for common use cases
export const SkeletonText = ({ 
  lines = 1, 
  className = '' 
}: { lines?: number; className?: string }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton 
          key={index}
          className={`h-4 ${index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`}
          width={index === lines - 1 && lines > 1 ? '75%' : '100%'}
          height="1rem"
        />
      ))}
    </div>
  );
};

export const SkeletonCard = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <Skeleton className="w-24 h-5" width="6rem" height="1.25rem" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="w-20 h-4" width="5rem" height="1rem" />
          <Skeleton className="w-16 h-4" width="4rem" height="1rem" />
        </div>
        
        <div className="flex justify-between items-center">
          <Skeleton className="w-24 h-4" width="6rem" height="1rem" />
          <Skeleton className="w-20 h-4" width="5rem" height="1rem" />
        </div>
        
        <div className="flex justify-between items-center">
          <Skeleton className="w-24 h-4" width="6rem" height="1rem" />
          <Skeleton className="w-20 h-4" width="5rem" height="1rem" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonSpinner = ({ 
  size = 'md', 
  className = '' 
}: { size?: 'sm' | 'md' | 'lg'; className?: string }) => {
  const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-blue-600 dark:border-blue-400 ${sizeClasses[size]} ${className}`} />
  );
};

export const SkeletonButton = ({ className = '' }: { className?: string }) => {
  return (
      <Skeleton className={`h-10 w-full rounded-lg ${className}`} width="100%" height="2.5rem" />
    );
};

export const SkeletonAvatar = ({ 
  size = 24, 
  className = '' 
}: { size?: number; className?: string }) => {
  return (
      <Skeleton 
        className={`rounded-full ${className}`}
        width={`${size}px`}
        height={`${size}px`}
        rounded={true}
      />
    );
};