import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, MapPin, User } from "lucide-react";
import { useCreateUser } from '../hooks/useUsers';
import { createUserSchema, type CreateUserFormData } from '../lib/schemas';
import LoadingSpinner from '../components/LoadingSpinner';
import { PageTransition, FadeIn, SlideIn } from '../components/motion';
import { motion } from 'framer-motion';

export default function CreateUser() {
  const navigate = useNavigate();
  const createUserMutation = useCreateUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      await createUserMutation.mutateAsync(data);
      navigate('/users');
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto space-y-8">
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
              <h1 className="section-header gradient-text">Create New User</h1>
              <p className="section-description">
                Add a new user with automatic geographic data enrichment
              </p>
            </div>
          </div>
        </FadeIn>

        <SlideIn direction="up" delay={0.2}>
          <div className="card">
            <div className="card-content">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    User Information
                  </h3>
                  <p className="text-dark-400 text-sm">
                    Enter the user's details for automatic location enrichment
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
                        <div className="w-8 h-8 bg-accent-cyan/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-4 w-4 text-accent-cyan" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white mb-1">
                            Automatic Location Enrichment
                          </p>
                          <p className="text-xs text-dark-300">
                            We'll automatically fetch geographic coordinates,
                            timezone, and location data from the OpenWeather API
                            when you submit this form.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={0.5}>
                  <div className="flex justify-end space-x-4 pt-6">
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
                          Creating User...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Create User
                        </>
                      )}
                    </motion.button>
                  </div>
                </FadeIn>
              </form>
            </div>
          </div>
        </SlideIn>
      </div>
    </PageTransition>
  );
} 