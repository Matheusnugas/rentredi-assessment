import { motion } from 'framer-motion';
import clsx from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'spinner' | 'pulse' | 'dots';
}

export default function LoadingSpinner({ 
  size = 'md', 
  className = '',
  variant = 'spinner'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  if (variant === 'pulse') {
    return (
      <motion.div
        className={clsx(
          "rounded-full bg-gradient-primary",
          sizeClasses[size],
          className
        )}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    );
  }

  if (variant === 'dots') {
    return (
      <div className={clsx("flex space-x-1", className)}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={clsx(
              "rounded-full bg-accent-cyan",
              size === "sm" ? "h-2 w-2" : size === "lg" ? "h-4 w-4" : "h-3 w-3"
            )}
            animate={{
              y: [-4, 4, -4],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={clsx(
        "border-2 border-dark-600 border-t-primary-500 rounded-full",
        sizeClasses[size],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
} 