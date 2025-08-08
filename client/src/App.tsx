import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UsersList from './pages/UsersList';
import CreateUser from './pages/CreateUser';
import EditUser from './pages/EditUser';

function App() {
  const location = useLocation();

  return (
    <Layout>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/new" element={<CreateUser />} />
          <Route path="/users/:id/edit" element={<EditUser />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default App; 