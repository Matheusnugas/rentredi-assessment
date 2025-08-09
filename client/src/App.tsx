import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ErrorBoundary from "./components/ErrorBoundary";
import ErrorTester from "./components/ErrorTester";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import UsersList from "./pages/UsersList";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import AnalyticsTest from "./components/AnalyticsTest";
import NotFound from "./pages/NotFound";

function App() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <Layout>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/new" element={<CreateUser />} />
            <Route path="/users/:id/edit" element={<EditUser />} />
            <Route path="/analytics-test" element={<AnalyticsTest />} />
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
        <ErrorTester />
      </Layout>
    </ErrorBoundary>
  );
}

export default App; 