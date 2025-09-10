'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'warning' | 'error';
  label?: string;
  showIcon?: boolean;
  showPulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  online: {
    color: 'bg-accent-neon',
    textColor: 'text-accent-neon',
    icon: CheckCircle,
    label: 'Online'
  },
  offline: {
    color: 'bg-red-400',
    textColor: 'text-red-400',
    icon: XCircle,
    label: 'Offline'
  },
  warning: {
    color: 'bg-accent-orange',
    textColor: 'text-accent-orange',
    icon: AlertTriangle,
    label: 'Warning'
  },
  error: {
    color: 'bg-red-500',
    textColor: 'text-red-500',
    icon: XCircle,
    label: 'Error'
  }
};

const sizeConfig = {
  sm: { dot: 'w-2 h-2', icon: 'w-3 h-3', text: 'text-xs' },
  md: { dot: 'w-3 h-3', icon: 'w-4 h-4', text: 'text-sm' },
  lg: { dot: 'w-4 h-4', icon: 'w-5 h-5', text: 'text-base' }
};

export function StatusIndicator({ 
  status, 
  label, 
  showIcon = false, 
  showPulse = true, 
  size = 'md' 
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const sizes = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div className="flex items-center space-x-2">
      {showIcon ? (
        <Icon className={`${sizes.icon} ${config.textColor}`} />
      ) : (
        <div className="relative">
          <div className={`${sizes.dot} ${config.color} rounded-full`} />
          {showPulse && status === 'online' && (
            <motion.div
              className={`absolute inset-0 ${sizes.dot} ${config.color} rounded-full`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </div>
      )}
      
      {label && (
        <span className={`${sizes.text} ${config.textColor} font-medium`}>
          {label || config.label}
        </span>
      )}
    </div>
  );
}