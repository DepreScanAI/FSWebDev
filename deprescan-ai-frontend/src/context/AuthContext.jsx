import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import api from '../services/api';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true saat inisialisasi untuk cek token

  useEffect(() => {
    const token = localStorage.getItem('deprescan_token');

    if (!token) {
      setLoading(false);
      return;
    }

    // Set header auth untuk semua request API
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    api
      .get('/auth/me')
      .then((res) => {
        setUser(res.data.data.user);
      })
      .catch(() => {
        // Token tidak valid atau error lain - anggap sebagai logout
        localStorage.removeItem('deprescan_token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = useCallback((token, userData) => {
    localStorage.setItem('deprescan_token', token);
    // Set header auth untuk semua request API
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('deprescan_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = { children: PropTypes.node.isRequired };

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
