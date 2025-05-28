import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({ 
  data, 
  color = '#00ff88', 
  height = 40 
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = range === 0 ? 50 : ((value - min) / range) * 100;
    return `${x},${100 - y}`;
  }).join(' ');

  const trend = data[data.length - 1] > data[0] ? 'up' : data[data.length - 1] < data[0] ? 'down' : 'neutral';
  const trendColor = trend === 'up' ? '#00ff88' : trend === 'down' ? '#ff4444' : '#ffaa00';

  return (
    <div className="relative" style={{ height: `${height}px` }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0"
      >
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.1 }} />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke={trendColor}
          strokeWidth="2"
          points={points}
          className="drop-shadow-sm"
        />
        <polygon
          fill={`url(#gradient-${color.replace('#', '')})`}
          points={`0,100 ${points} 100,100`}
        />
      </svg>
      <div className="absolute top-1 right-1">
        {trend === 'up' && <TrendingUp className="w-3 h-3 text-green-400" />}
        {trend === 'down' && <TrendingDown className="w-3 h-3 text-red-400" />}
        {trend === 'neutral' && <Activity className="w-3 h-3 text-yellow-400" />}
      </div>
    </div>
  );
};

interface MarketSentimentBadgeProps {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  strength: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
}

export const MarketSentimentBadge: React.FC<MarketSentimentBadgeProps> = ({ 
  sentiment, 
  strength, 
  size = 'md' 
}) => {
  const getColors = () => {
    switch (sentiment) {
      case 'bullish':
        return {
          bg: 'bg-green-500/20',
          border: 'border-green-500/40',
          text: 'text-green-400',
          glow: 'shadow-green-500/20'
        };
      case 'bearish':
        return {
          bg: 'bg-red-500/20',
          border: 'border-red-500/40',
          text: 'text-red-400',
          glow: 'shadow-red-500/20'
        };
      default:
        return {
          bg: 'bg-yellow-500/20',
          border: 'border-yellow-500/40',
          text: 'text-yellow-400',
          glow: 'shadow-yellow-500/20'
        };
    }
  };

  const getSizes = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  const colors = getColors();
  const sizes = getSizes();

  return (
    <div className={`
      inline-flex items-center gap-2 rounded-lg border-2 font-semibold
      ${colors.bg} ${colors.border} ${colors.text} ${sizes}
      shadow-lg ${colors.glow} backdrop-blur-sm
    `}>
      <div className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${colors.text.replace('text-', 'bg-')} animate-pulse`}></div>
        <span className="capitalize font-mono">{sentiment}</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-8 bg-terminal-border/50 rounded-full h-1">
          <div 
            className={`h-1 rounded-full transition-all duration-500 ${colors.text.replace('text-', 'bg-')}`}
            style={{ width: `${strength}%` }}
          ></div>
        </div>
        <span className="text-xs opacity-80">{strength}%</span>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  sparklineData?: number[];
  icon?: React.ReactNode;
  description?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  sparklineData,
  icon,
  description
}) => {
  const getChangeColor = () => {
    if (!change) return 'text-terminal-text/70';
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getChangeIcon = () => {
    if (!change) return null;
    return change >= 0 ? 
      <TrendingUp className="w-3 h-3" /> : 
      <TrendingDown className="w-3 h-3" />;
  };

  return (
    <div className="metric-card p-4 h-full">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && <div className="text-terminal-accent">{icon}</div>}
          <h4 className="text-sm font-semibold text-terminal-text/80">{title}</h4>
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-mono ${getChangeColor()}`}>
            {getChangeIcon()}
            <span>{change >= 0 ? '+' : ''}{change.toFixed(2)}%</span>
          </div>
        )}
      </div>
      
      <div className="mb-3">
        <div className="text-2xl font-bold text-terminal-text font-mono">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {description && (
          <p className="text-xs text-terminal-text/60 mt-1">{description}</p>
        )}
      </div>

      {sparklineData && sparklineData.length > 0 && (
        <div className="mt-auto">
          <Sparkline data={sparklineData} height={32} />
        </div>
      )}
    </div>
  );
};

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 80,
  strokeWidth = 8,
  color = '#00ff88',
  label
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(42, 42, 42, 0.8)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${color}40)`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-lg font-bold text-terminal-text font-mono">
          {Math.round(progress)}%
        </div>
        {label && (
          <div className="text-xs text-terminal-text/60 text-center">
            {label}
          </div>
        )}
      </div>
    </div>
  );
};

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top' 
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`
          absolute z-50 px-3 py-2 text-xs text-white bg-terminal-bg/95 
          border border-terminal-border rounded-lg shadow-lg backdrop-blur-sm
          whitespace-nowrap ${getPositionClasses()}
        `}>
          {content}
          <div className={`
            absolute w-2 h-2 bg-terminal-bg/95 border-terminal-border transform rotate-45
            ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1 border-b border-r' : ''}
            ${position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-t border-l' : ''}
            ${position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1 border-t border-r' : ''}
            ${position === 'right' ? 'right-full top-1/2 -translate-y-1/2 -mr-1 border-b border-l' : ''}
          `}></div>
        </div>
      )}
    </div>
  );
};
