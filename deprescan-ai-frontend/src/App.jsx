import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import RequireAuth from './components/auth/RequireAuth';
import NotFoundPage from './pages/NotFoundPage';

import Beranda from './pages/Beranda';
import Tentang from './pages/Tentang';
import Riwayat from './pages/Riwayat';
import Screening from './pages/Screening';
import Hasil from './pages/Hasil';
import RiwayatDetail from './pages/RiwayatDetail';

import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function AppContent() {
  return (
    <Routes>
      {/* Halaman auth public tanpa protected  */}
      <Route path="/login" element={<Login />}></Route>
      <Route path="/forgot-password" element={<ForgotPassword />}></Route>
      <Route path="/reset-password" element={<ResetPassword />}></Route>

      {/* Halaman web public tanpa protected*/}
      <Route
        path="/"
        element={
          <Layout>
            <Beranda />
          </Layout>
        }
      />
      <Route
        path="/tentang"
        element={
          <Layout>
            <Tentang />
          </Layout>
        }
      />

      {/* Bungkus dengan RequireAuth memerlukan login terlebih dahulu buat halaman screening dan hasil dengan id */}
      <Route
        path="/screening"
        element={
          <RequireAuth>
            <Layout>
              <Screening />
            </Layout>
          </RequireAuth>
        }
      />

      <Route
        path="/hasil/:id"
        element={
          <RequireAuth>
            <Layout>
              <Hasil />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/riwayat"
        element={
          <RequireAuth>
            <Layout>
              <Riwayat />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/riwayat/:id"
        element={
          <RequireAuth>
            <Layout>
              <RiwayatDetail />
            </Layout>
          </RequireAuth>
        }
      />

      {/* Halaman hasil tanpa id diarahkan ke screening */}
      <Route path="/hasil" element={<Navigate to="/screening" replace />} />

      {/* Halaman 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      {/* Panggil fungsi AppContent yang sudah dibuat diatas */}
      <AppContent />
    </AuthProvider>
  );
}
