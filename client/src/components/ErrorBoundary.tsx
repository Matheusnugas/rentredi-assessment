import { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    // In production, you would send this to your error reporting service
    // Example: sendErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full"
          >
            <div className="card">
              <div className="card-content text-center">
                {/* Error Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                >
                  <AlertTriangle className="h-10 w-10 text-red-400" />
                </motion.div>

                {/* Error Title */}
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-white mb-3"
                >
                  Oops! Something went wrong
                </motion.h1>

                {/* Error Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-dark-300 mb-6"
                >
                  We're sorry, but something unexpected happened. Please try refreshing the page or go back to the homepage.
                </motion.p>

                {/* Error Details (Development only) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mb-6 p-4 bg-dark-800 rounded-xl border border-dark-600 text-left"
                  >
                    <h3 className="text-sm font-semibold text-red-400 mb-2">
                      Error Details (Development)
                    </h3>
                    <pre className="text-xs text-dark-300 overflow-auto max-h-32">
                      {this.state.error.message}
                      {this.state.errorInfo?.componentStack && (
                        <>
                          {'\n\nComponent Stack:'}
                          {this.state.errorInfo.componentStack}
                        </>
                      )}
                    </pre>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <button
                    onClick={this.handleRetry}
                    className="btn btn-primary flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </button>
                  <button
                    onClick={this.handleGoHome}
                    className="btn btn-secondary flex-1"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
} 