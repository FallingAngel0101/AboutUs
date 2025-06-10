import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header, Footer } from './components/ui/layout';
import HomePage from './components/pages/HomePage';
import ProfilePage from './components/pages/ProfilePage/ProfilePage';
import MyReviewsPage from './components/pages/MyReviewsPage';
import LoginPage from './components/pages/LoginPage/LoginPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './App.module.css';
import { AuthProvider } from './context/AuthContext';
import UserProfilePage from './components/pages/UserProfilePage/UserProfilePage';

const AppWrapper: React.FC = () => {
  return (
    <Router>
      <AuthProvider> {/* Обертываем все приложение в AuthProvider */}
        <App />
      </AuthProvider>
    </Router>
  );
};

const App: React.FC = () => {
  const location = useLocation();
  const hideLayout = location.pathname === '/login';

  return (
    <div className={styles.app}>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {!hideLayout && <Header />}

      <main className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/users/:userId" element={<UserProfilePage />} />
          <Route path="/reviews/received" element={<MyReviewsPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>

      {/* {!hideLayout && <Footer />} */}
    </div>
  );
};

export default AppWrapper;