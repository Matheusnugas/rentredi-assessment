import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Link } from 'react-router-dom';
import { Users, MapPin, Plus, Edit, Globe, Clock, Eye } from "lucide-react";
import { useUsers } from "../hooks/useUsers";
import LoadingSpinner from "../components/LoadingSpinner";
import { PageTransition, FadeIn, StaggerChildren } from "../components/motion";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";

const defaultIcon = new Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function Dashboard() {
  const { data: users, isLoading, error } = useUsers();

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
              Loading your dashboard...
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
                <Eye className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Failed to load dashboard
              </h3>
              <p className="text-dark-400">{error.message}</p>
            </div>
          </div>
        </FadeIn>
      </PageTransition>
    );
  }

  const centerLat =
    users && users.length > 0
      ? users.reduce((sum, user) => sum + user.latitude, 0) / users.length
      : 39.8283;

  const centerLng =
    users && users.length > 0
      ? users.reduce((sum, user) => sum + user.longitude, 0) / users.length
      : -98.5795;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stats = [
    {
      name: "Total Users",
      value: users?.length || 0,
      icon: Users,
      color: "from-primary-600 to-primary-700",
      description: "Registered users",
      trend: "+12%",
    },
    {
      name: "Locations",
      value: users ? new Set(users.map((u) => u.zipCode)).size : 0,
      icon: MapPin,
      color: "from-accent-emerald to-green-600",
      description: "Unique locations",
      trend: "+8%",
    },
    {
      name: "Timezones",
      value: users ? new Set(users.map((u) => u.timezone)).size : 0,
      icon: Globe,
      color: "from-accent-purple to-purple-600",
      description: "Different timezones",
      trend: "+5%",
    },
    {
      name: "Latest User",
      value: users?.length
        ? formatDate(users[users.length - 1].createdAt)
        : "-",
      icon: Clock,
      color: "from-accent-orange to-orange-600",
      description: "Most recent signup",
      trend: "Today",
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-8">
        <FadeIn delay={0.1}>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
            <div>
              <h1 className="section-header gradient-text">Dashboard</h1>
              <p className="section-description">
                Comprehensive overview of your user base and geographic
                distribution
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

        <StaggerChildren staggerDelay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.name}
                  className="stat-card card-content relative"
                  whileHover={{ y: -4 }}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-br opacity-5"
                    style={{
                      backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                    }}
                  />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium text-accent-emerald bg-accent-emerald/20 px-2 py-1 rounded-full">
                          {stat.trend}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-2xl font-bold text-white mb-1">
                        {typeof stat.value === "number"
                          ? stat.value.toLocaleString()
                          : stat.value}
                      </p>
                      <p className="text-sm font-medium text-white/90">
                        {stat.name}
                      </p>
                      <p className="text-xs text-dark-400 mt-1">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </StaggerChildren>

        <FadeIn delay={0.3}>
          <div className="card overflow-hidden">
            <div className="card-content border-b border-glass-medium">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    Geographic Distribution
                  </h3>
                  <p className="text-dark-400">
                    Interactive map showing user locations worldwide
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-dark-300">Live Data</span>
                </div>
              </div>
            </div>

            <div className="h-96 relative">
              {users && users.length > 0 ? (
                <MapContainer
                  center={[centerLat, centerLng]}
                  zoom={users.length === 1 ? 10 : 4}
                  className="h-full w-full rounded-b-2xl"
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {users.map((user) => (
                    <Marker
                      key={user.id}
                      position={[user.latitude, user.longitude]}
                      icon={defaultIcon}
                    >
                      <Popup className="dark-popup">
                        <div className="bg-dark-800 p-4 rounded-xl border border-dark-600 min-w-64">
                          <div className="border-b border-dark-600 pb-3 mb-3">
                            <h4 className="font-semibold text-white text-lg">
                              {user.name}
                            </h4>
                            <p className="text-dark-400 text-sm">
                              ID: {user.id}
                            </p>
                          </div>

                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-dark-400">ZIP Code:</span>
                              <span className="font-medium text-white bg-dark-700 px-2 py-1 rounded">
                                {user.zipCode}
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-dark-400">
                                Coordinates:
                              </span>
                              <span className="font-mono text-accent-cyan text-xs">
                                {user.latitude.toFixed(4)},{" "}
                                {user.longitude.toFixed(4)}
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-dark-400">Timezone:</span>
                              <span className="font-medium text-white">
                                {user.timezone}
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-dark-400">Created:</span>
                              <span className="text-white">
                                {formatDate(user.createdAt)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-dark-600">
                            <Link
                              to={`/users/${user.id}/edit`}
                              className="inline-flex items-center px-3 py-2 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 transition-colors"
                            >
                              <Edit className="h-3 w-3 mr-2 text-white" />
                              <span className="text-white font-medium">
                                Edit User
                              </span>
                            </Link>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              ) : (
                <div className="h-full flex items-center justify-center bg-dark-800">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-dark-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <MapPin className="h-10 w-10 text-dark-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No Geographic Data
                    </h3>
                    <p className="text-dark-400 mb-6 max-w-sm">
                      Add your first user to visualize geographic distribution
                      on the interactive map.
                    </p>
                    <Link to="/users/new" className="btn btn-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Add First User
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </FadeIn>

        {users && users.length > 0 && (
          <FadeIn delay={0.4}>
            <div className="card card-content">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    Recent Activity
                  </h3>
                  <p className="text-dark-400">
                    Latest user registrations and updates
                  </p>
                </div>
                <Link
                  to="/users"
                  className="text-sm text-accent-cyan hover:text-accent-cyan/80 font-medium"
                >
                  View All Users →
                </Link>
              </div>

              <div className="space-y-4">
                {users
                  .slice(-5)
                  .reverse()
                  .map((user, index) => (
                    <motion.div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border border-dark-700 hover:border-dark-600 transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <div className="flex items-center space-x-3 text-sm text-dark-400">
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {user.zipCode}
                            </span>
                            <span className="flex items-center">
                              <Globe className="h-3 w-3 mr-1" />
                              {user.timezone}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-dark-400 text-sm">
                          {formatDate(user.createdAt)}
                        </p>
                        <Link
                          to={`/users/${user.id}/edit`}
                          className="text-accent-cyan hover:text-accent-cyan/80 text-sm font-medium"
                        >
                          Edit
                        </Link>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </PageTransition>
  );
} 