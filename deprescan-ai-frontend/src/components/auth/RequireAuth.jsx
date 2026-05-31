import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../loading/LoadingSpinner';
import PropTypes from 'prop-types';

// halaman memerlukan auth terlebih dahulu diarahkan ke login
export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;

  if (!user) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return children;
}

RequireAuth.propTypes = { children: PropTypes.node.isRequired };
