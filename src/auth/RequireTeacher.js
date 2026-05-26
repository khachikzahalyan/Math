import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Loader from '../components/Loader/Loader';

export default function RequireTeacher({ children }) {
  const { user, isTeacher, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isTeacher) return <Navigate to="/lessons" replace />;
  return children;
}
