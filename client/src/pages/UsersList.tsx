import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, MapPin, Clock, Users } from "lucide-react";
import { useState } from "react";
import { useUsers, useDeleteUser } from "../hooks/useUsers";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmationModal from "../components/ConfirmationModal";
import { PageTransition, FadeIn, StaggerChildren } from "../components/motion";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "../types/api";

export default function UsersList() {
  const { data: users, isLoading, error } = useUsers();
  const deleteUserMutation = useDeleteUser();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleDelete = (user: User) => {
    setUserToDelete(user);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete.id);
      setUserToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setUserToDelete(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <LoadingSpinner size="lg" variant="dots" />
            <motion.p
              className="mt-6 text-dark-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Loading users...
            </motion.p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <FadeIn>
          <div className="card card-content">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Failed to load users
              </h3>
              <p className="text-dark-400">{error.message}</p>
            </div>
          </div>
        </FadeIn>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <FadeIn delay={0.1}>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
            <div>
              <h1 className="section-header gradient-text">Users</h1>
              <p className="section-description">
                Manage all registered users and their geographic information
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/users/new" className="btn btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add New User
              </Link>
            </motion.div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="card overflow-hidden">
            {users && users.length > 0 ? (
              <>
                <div className="hidden md:block">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="table-header border-b border-glass-medium">
                          <th className="px-6 py-4 text-left text-xs font-semibold text-dark-200 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-dark-200 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-dark-200 uppercase tracking-wider">
                            Coordinates
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-dark-200 uppercase tracking-wider">
                            Timezone
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-dark-200 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-dark-200 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-glass-medium">
                        <AnimatePresence>
                          {users.map((user, index) => (
                            <motion.tr
                              key={user.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -100 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                              }}
                              layout
                              className="table-row hover:bg-glass-light"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                    <span className="text-sm font-semibold text-white">
                                      {user.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-white">
                                      {user.name}
                                    </div>
                                    <div className="text-sm text-dark-400">
                                      ID: {user.id}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 text-accent-emerald mr-2" />
                                  <span className="text-sm text-white font-medium">
                                    {user.zipCode}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-300">
                                <div className="space-y-1 font-mono">
                                  <div className="text-xs">
                                    Lat:{" "}
                                    <span className="text-accent-cyan">
                                      {user.latitude.toFixed(4)}
                                    </span>
                                  </div>
                                  <div className="text-xs">
                                    Lng:{" "}
                                    <span className="text-accent-cyan">
                                      {user.longitude.toFixed(4)}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 text-accent-purple mr-2" />
                                  <span className="text-sm text-white">
                                    {user.timezone}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-300">
                                {formatDate(user.createdAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Link
                                      to={`/users/${user.id}/edit`}
                                      className="p-2 text-accent-cyan hover:text-accent-cyan/80 hover:bg-accent-cyan/10 rounded-lg transition-all duration-200"
                                      title="Edit user"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Link>
                                  </motion.div>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleDelete(user)}
                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                                    title="Delete user"
                                    disabled={deleteUserMutation.isPending}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="md:hidden">
                  <StaggerChildren staggerDelay={0.1}>
                    <div className="space-y-4 p-6">
                      <AnimatePresence>
                        {users.map((user) => (
                          <motion.div
                            key={user.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, x: -100 }}
                            transition={{ duration: 0.3 }}
                            className="glass-panel p-4 hover:bg-glass-medium transition-all duration-300"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                                  <span className="text-white font-semibold">
                                    {user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="font-medium text-white">
                                    {user.name}
                                  </h3>
                                  <p className="text-sm text-dark-400">
                                    ID: {user.id}
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Link
                                    to={`/users/${user.id}/edit`}
                                    className="p-2 text-accent-cyan hover:bg-accent-cyan/10 rounded-lg transition-colors"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Link>
                                </motion.div>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDelete(user)}
                                  disabled={deleteUserMutation.isPending}
                                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                  {deleteUserMutation.isPending ? (
                                    <LoadingSpinner size="sm" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </motion.button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="flex items-center text-dark-400 mb-2">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  Location
                                </div>
                                <p className="font-medium text-white">
                                  ZIP: {user.zipCode}
                                </p>
                                <p className="text-xs text-dark-400 font-mono">
                                  {user.latitude.toFixed(4)},{" "}
                                  {user.longitude.toFixed(4)}
                                </p>
                              </div>
                              <div>
                                <div className="flex items-center text-dark-400 mb-2">
                                  <Clock className="h-4 w-4 mr-1" />
                                  Timezone
                                </div>
                                <p className="font-medium text-white">
                                  {user.timezone}
                                </p>
                                <p className="text-xs text-dark-400">
                                  {formatDate(user.createdAt)}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </StaggerChildren>
                </div>
              </>
            ) : (
              <FadeIn delay={0.3}>
                <div className="text-center py-16 card-content">
                  <div className="w-20 h-20 bg-dark-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="h-10 w-10 text-dark-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No users found
                  </h3>
                  <p className="text-dark-400 mb-8 max-w-sm mx-auto">
                    Get started by creating your first user and begin building
                    your user database.
                  </p>
                  <Link to="/users/new" className="btn btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First User
                  </Link>
                </div>
              </FadeIn>
            )}
          </div>
        </FadeIn>
      </div>

      <ConfirmationModal
        isOpen={!!userToDelete}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={
          userToDelete
            ? `Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteUserMutation.isPending}
      />
    </PageTransition>
  );
} 