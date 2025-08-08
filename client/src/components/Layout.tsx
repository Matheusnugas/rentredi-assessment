import { Link, useLocation } from 'react-router-dom';
import { Users, Plus, Home, BarChart3, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: BarChart3,
      current: location.pathname === '/' || location.pathname === '/dashboard',
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
      current: location.pathname === '/users',
    },
    {
      name: 'Add User',
      href: '/users/new',
      icon: Plus,
      current: location.pathname === '/users/new',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col">
      <header className="sticky top-0 z-50 bg-glass-light backdrop-blur-md border-b border-glass-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                  <Home className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">
                    <span className="hidden sm:inline">RentRedi</span>
                  </h1>
                  <p className="text-xs text-dark-400 hidden lg:block">
                    User Management System
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.nav
              className="hidden md:flex items-center space-x-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {navigation.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      className={`navigation-link ${
                        item.current
                          ? "navigation-link-active"
                          : "navigation-link-inactive"
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>

            <div className="md:hidden">
              <motion.button
                type="button"
                className="p-2 rounded-xl bg-glass-light border border-glass-medium text-white hover:bg-glass-medium focus:outline-none focus:ring-2 focus:ring-primary-500 backdrop-blur-md"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                className="md:hidden border-t border-glass-medium bg-glass-light backdrop-blur-md"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <motion.div
                  className="py-4 space-y-2"
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  exit={{ y: -20 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  {navigation.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                      >
                        <Link
                          to={item.href}
                          className={`navigation-link mx-2 ${
                            item.current
                              ? "navigation-link-active"
                              : "navigation-link-inactive"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          <span>{item.name}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <motion.main
        className="flex-1 max-w-7xl w-full mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {children}
      </motion.main>

      <motion.footer
        className="border-t border-glass-medium bg-glass-light backdrop-blur-md mt-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-dark-400 text-xs sm:text-sm">
              <span className="hidden sm:inline">
                RentRedi Technical Assessment - Modern User Management with
                Geographic Intelligence
              </span>
              <span className="sm:hidden">RentRedi Assessment</span>
            </p>
            <div className="mt-1 flex justify-center space-x-4 text-xs text-dark-500">
              <span>TypeScript</span>
              <span>•</span>
              <span>React</span>
              <span>•</span>
              <span>Framer Motion</span>
              <span>•</span>
              <span>Tailwind CSS</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
} 