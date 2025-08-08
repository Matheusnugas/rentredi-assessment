import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Bomb, Bug, ChevronDown, ChevronUp } from 'lucide-react';

interface ErrorTesterProps {
  onError?: () => void;
}

export default function ErrorTester({ onError }: ErrorTesterProps) {
  const [shouldThrow, setShouldThrow] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // This will trigger the error boundary
  if (shouldThrow) {
    throw new Error('Test error: Error Boundary triggered by ErrorTester component');
  }

  const triggerError = () => {
    setShouldThrow(true);
    if (onError) onError();
  };

  const triggerAsyncError = () => {
    // This won't be caught by Error Boundary (async errors aren't caught)
    setTimeout(() => {
      throw new Error('Async error: This won\'t be caught by Error Boundary');
    }, 100);
  };

  const triggerNetworkError = () => {
    // Simulate a network error
    fetch('http://invalid-url-that-does-not-exist.com')
      .catch((error) => {
        console.error('Network error:', error);
        // You could throw this to trigger the boundary
        throw new Error('Network Error: Failed to fetch data');
      });
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl backdrop-blur-md overflow-hidden">
        {/* Header - Always Visible */}
        <motion.div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-yellow-500/5 transition-colors"
          onClick={() => setIsMinimized(!isMinimized)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center">
            <Bug className="h-5 w-5 text-yellow-400 mr-2" />
            <h3 className="text-sm font-semibold text-yellow-400">
              Error Testing
            </h3>
          </div>
          <motion.div
            animate={{ rotate: isMinimized ? 0 : 180 }}
            transition={{ duration: 0.2 }}
          >
            {isMinimized ? (
              <ChevronUp className="h-4 w-4 text-yellow-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-yellow-400" />
            )}
          </motion.div>
        </motion.div>
        
        {/* Content - Collapsible */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="border-t border-yellow-500/20"
            >
              <div className="p-4 pt-3">
                <div className="space-y-2">
                  <motion.button
                    onClick={triggerError}
                    className="w-full text-left px-3 py-2 text-xs bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors flex items-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Trigger Error Boundary
                  </motion.button>
                  
                  <motion.button
                    onClick={triggerAsyncError}
                    className="w-full text-left px-3 py-2 text-xs bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30 transition-colors flex items-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Bomb className="h-4 w-4 mr-2" />
                    Async Error (Console)
                  </motion.button>
                  
                  <motion.button
                    onClick={triggerNetworkError}
                    className="w-full text-left px-3 py-2 text-xs bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Network Error Test
                  </motion.button>
                </div>
                
                <p className="text-xs text-yellow-600 mt-3">
                  ⚠️ These buttons will trigger errors for testing
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
} 