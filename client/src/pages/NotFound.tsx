import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Users, Search, MapPin } from 'lucide-react';
import { PageTransition, FadeIn } from '../components/motion';

export default function NotFound() {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const quickLinks = [
    {
      title: 'Dashboard',
      description: 'View system overview and statistics',
      href: '/',
      icon: Home,
      color: 'from-blue-600 to-blue-700',
    },
    {
      title: 'Users List',
      description: 'Browse all registered users',
      href: '/users',
      icon: Users,
      color: 'from-emerald-600 to-emerald-700',
    },
    {
      title: 'Add New User',
      description: 'Create a new user with location data',
      href: '/users/new',
      icon: MapPin,
      color: 'from-purple-600 to-purple-700',
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center px-4">
          <FadeIn delay={0.1}>
            {/* 404 Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="mb-8"
            >
              <div className="relative">
                {/* Main 404 Text */}
                <motion.h1
                  className="text-9xl md:text-[12rem] font-bold gradient-text opacity-20 select-none"
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  404
                </motion.h1>
                
                {/* Floating Elements */}
                <motion.div
                  className="absolute top-1/4 left-1/4 w-4 h-4 bg-accent-cyan rounded-full"
                  animate={{
                    y: [0, -20, 0],
                    x: [0, 10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
                <motion.div
                  className="absolute top-1/3 right-1/4 w-3 h-3 bg-accent-purple rounded-full"
                  animate={{
                    y: [0, 15, 0],
                    x: [0, -8, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
                <motion.div
                  className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-accent-emerald rounded-full"
                  animate={{
                    y: [0, -12, 0],
                    x: [0, 12, 0],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5
                  }}
                />
              </div>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Page Not Found
              </h2>
              <p className="text-lg text-dark-300 max-w-2xl mx-auto">
                Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or the URL might be incorrect.
              </p>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.5}>
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <motion.button
                onClick={goBack}
                className="btn btn-secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </motion.button>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link to="/" className="btn btn-primary">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Link>
              </motion.div>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.7}>
            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-xl font-semibold text-white mb-6">
                Or explore these sections:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to={link.href}
                        className="block card hover:shadow-glow transition-all duration-300"
                      >
                        <div className="card-content">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-4 mx-auto`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold text-white mb-2">
                            {link.title}
                          </h4>
                          <p className="text-sm text-dark-400">
                            {link.description}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </FadeIn>

          <FadeIn delay={1.2}>
            {/* Search Suggestion */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="mt-12 p-6 bg-glass-light backdrop-blur-md border border-glass-medium rounded-2xl max-w-md mx-auto"
            >
              <div className="flex items-center justify-center mb-3">
                <div className="w-10 h-10 bg-accent-cyan/20 rounded-xl flex items-center justify-center">
                  <Search className="h-5 w-5 text-accent-cyan" />
                </div>
              </div>
              <h4 className="text-white font-medium mb-2">
                Can't find what you're looking for?
              </h4>
              <p className="text-dark-400 text-sm">
                Try checking the URL for typos, or navigate using the menu above.
              </p>
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  );
} 