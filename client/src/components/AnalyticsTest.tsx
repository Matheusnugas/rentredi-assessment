
import { motion } from 'framer-motion';
import { BarChart3, Activity, MousePointer, Eye } from 'lucide-react';
import { analytics } from '../lib/analytics';

export default function AnalyticsTest() {
  const sessionInfo = analytics.getSessionInfo();

  const testAnalytics = () => {
    analytics.trackUserAction('manual_test', {
      testType: 'button_click',
      timestamp: new Date().toISOString(),
    });
  };

  const testError = () => {
    try {
      throw new Error('Test error for analytics');
    } catch (error) {
      analytics.trackError(error as Error, {
        context: 'manual_test',
        testType: 'error_tracking',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-blue-500/5 border-blue-500/20"
    >
      <div className="card-content p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Analytics Test Panel</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 text-green-400" />
              <span className="text-dark-300">Session ID:</span>
              <code className="text-xs bg-dark-800 px-2 py-1 rounded">
                {sessionInfo.sessionId.slice(0, 20)}...
              </code>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <MousePointer className="h-4 w-4 text-blue-400" />
              <span className="text-dark-300">Page Views:</span>
              <span className="text-white font-medium">{sessionInfo.pageViews}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4 text-purple-400" />
              <span className="text-dark-300">Interactions:</span>
              <span className="text-white font-medium">{sessionInfo.interactions}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-dark-300">Session Duration:</span>
              <span className="text-white font-medium">
                {Math.round(sessionInfo.sessionDuration / 1000)}s
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-dark-300">Correlation ID:</span>
              <code className="text-xs bg-dark-800 px-2 py-1 rounded">
                {sessionInfo.correlationId || 'Not set'}
              </code>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-dark-300">Screen:</span>
              <span className="text-white font-medium">
                {screen.width}×{screen.height}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-dark-300">Viewport:</span>
              <span className="text-white font-medium">
                {window.innerWidth}×{window.innerHeight}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-dark-300">Timezone:</span>
              <span className="text-white font-medium">
                {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={testAnalytics}
            className="btn btn-primary btn-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Test Analytics Event
          </motion.button>
          
          <motion.button
            onClick={testError}
            className="btn btn-secondary btn-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Test Error Tracking
          </motion.button>
        </div>

        <div className="mt-4 text-xs text-dark-400">
          <p>This panel demonstrates the analytics system. Check the browser console and backend logs to see the tracked data.</p>
        </div>
      </div>
    </motion.div>
  );
}
