import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SlideInProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
}

export default function SlideIn({
  children,
  direction = 'left',
  delay = 0,
  duration = 0.6,
  className = '',
}: SlideInProps) {
  const getInitialPosition = () => {
    const distance = 50;
    switch (direction) {
      case 'left':
        return { x: -distance };
      case 'right':
        return { x: distance };
      case 'up':
        return { y: -distance };
      case 'down':
        return { y: distance };
      default:
        return { x: -distance };
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...getInitialPosition(),
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
} 