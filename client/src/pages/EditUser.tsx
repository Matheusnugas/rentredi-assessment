import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, MapPin, Clock, User, Globe } from "lucide-react";
import { useUser, useUpdateUser } from '../hooks/useUsers';
import { updateUserSchema, type UpdateUserFormData } from '../lib/schemas';
import LoadingSpinner from '../components/LoadingSpinner';
import { PageTransition, FadeIn, SlideIn } from '../components/motion';
import { motion } from 'framer-motion';

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, error } = useUser(id!);
  const updateUserMutation = useUpdateUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    values: user ? {
      name: user.name,
      zipCode: user.zipCode,
    } : undefined,
  });

  const onSubmit = async (data: UpdateUserFormData) => {
    if (!id) return;
    
    try {
      await updateUserMutation.mutateAsync({ id, userData: data });
      navigate('/users');
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <LoadingSpinner size="lg" variant="pulse" />
            <motion.p
              className="mt-6 text-dark-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Loading user details...
            </motion.p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error || !user) {
    return (
      <PageTransition>
        <FadeIn>
          <div className="card card-content">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Failed to load user
              </h3>
              <p className="text-dark-400 mb-6">
                {error?.message || "User not found"}
              </p>
              <motion.button
                onClick={() => navigate("/users")}
                className="btn btn-secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Users
              </motion.button>
            </div>
          </div>
        </FadeIn>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-8">
        <FadeIn delay={0.1}>
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => navigate("/users")}
              className="btn btn-ghost w-12 h-12 p-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <div>
              <h1 className="section-header gradient-text">Edit User</h1>
              <p className="section-description">
                Update user information and location data
              </p>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SlideIn direction="left" delay={0.2}>
            <div className="card">
              <div className="card-content">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Edit Information
                    </h3>
                    <p className="text-dark-400 text-sm">
                      Update user details. Location data refreshes
                      automatically.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <FadeIn delay={0.3}>
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-white mb-3"
                      >
                        Full Name *
                      </label>
                      <input
                        {...register("name")}
                        type="text"
                        id="name"
                        className={`input-field ${
                          errors.name
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                        placeholder="Enter user's full name"
                      />
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-400 flex items-center"
                        >
                          <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center mr-2">
                            <span className="text-white text-xs">!</span>
                          </span>
                          {errors.name.message}
                        </motion.p>
                      )}
                    </div>
                  </FadeIn>

                  <FadeIn delay={0.4}>
                    <div>
                      <label
                        htmlFor="zipCode"
                        className="block text-sm font-medium text-white mb-3"
                      >
                        ZIP Code *
                      </label>
                      <div className="relative">
                        <input
                          {...register("zipCode")}
                          type="text"
                          id="zipCode"
                          className={`input-field pl-10 ${
                            errors.zipCode
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : ""
                          }`}
                          placeholder="Enter ZIP code (e.g., 10001)"
                        />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-400" />
                      </div>
                      {errors.zipCode && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-400 flex items-center"
                        >
                          <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center mr-2">
                            <span className="text-white text-xs">!</span>
                          </span>
                          {errors.zipCode.message}
                        </motion.p>
                      )}
                      <div className="mt-3 p-4 bg-glass-light rounded-xl border border-glass-medium">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-accent-orange/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Globe className="h-4 w-4 text-accent-orange" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white mb-1">
                              Smart Location Updates
                            </p>
                            <p className="text-xs text-dark-300">
                              Changing the ZIP code will automatically update
                              coordinates and timezone data via OpenWeather API.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </FadeIn>

                  <FadeIn delay={0.5}>
                    <div className="flex justify-end space-x-4 pt-6 border-t border-glass-medium">
                      <motion.button
                        type="button"
                        onClick={() => navigate("/users")}
                        className="btn btn-secondary"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isSubmitting ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Updating User...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Update User
                          </>
                        )}
                      </motion.button>
                    </div>
                  </FadeIn>
                </form>
              </div>
            </div>
          </SlideIn>

          <SlideIn direction="right" delay={0.3}>
            <div className="card">
              <div className="card-content">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Current Information
                    </h3>
                    <p className="text-dark-400 text-sm">
                      Live user details and geographic data
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <FadeIn delay={0.4}>
                    <div className="glass-panel p-4">
                      <h4 className="text-white font-medium mb-3 flex items-center">
                        <User className="h-4 w-4 mr-2 text-accent-cyan" />
                        User Details
                      </h4>
                      <div className="grid grid-cols-1 gap-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-dark-400">User ID:</span>
                          <span className="font-mono text-accent-cyan bg-dark-800 px-2 py-1 rounded">
                            {user.id}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-dark-400">Current Name:</span>
                          <span className="font-medium text-white">
                            {user.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </FadeIn>

                  <FadeIn delay={0.5}>
                    <div className="glass-panel p-4">
                      <h4 className="text-white font-medium mb-3 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-accent-emerald" />
                        Geographic Data
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-dark-400">ZIP Code:</span>
                          <span className="font-medium text-white bg-dark-800 px-2 py-1 rounded">
                            {user.zipCode}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-dark-400">Latitude:</span>
                          <span className="font-mono text-accent-cyan">
                            {user.latitude.toFixed(6)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-dark-400">Longitude:</span>
                          <span className="font-mono text-accent-cyan">
                            {user.longitude.toFixed(6)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </FadeIn>

                  <FadeIn delay={0.6}>
                    <div className="glass-panel p-4">
                      <h4 className="text-white font-medium mb-3 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-accent-purple" />
                        Timezone Information
                      </h4>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-dark-400">Timezone:</span>
                        <span className="font-medium text-white bg-dark-800 px-2 py-1 rounded">
                          {user.timezone}
                        </span>
                      </div>
                    </div>
                  </FadeIn>

                  <FadeIn delay={0.7}>
                    <div className="glass-panel p-4">
                      <h4 className="text-white font-medium mb-3">
                        Timestamps
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-dark-400">Created:</span>
                          <span className="text-white">
                            {formatDate(user.createdAt)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-dark-400">Updated:</span>
                          <span className="text-white">
                            {formatDate(user.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                </div>
              </div>
            </div>
          </SlideIn>
        </div>
      </div>
    </PageTransition>
  );
} 