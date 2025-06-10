import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import styles from './Header.module.css';
import AuthModal from '../../../AuthModal/AuthModal';

const Header: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    id: string;
  } | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName');
      
      if (token && userId && userName) {
        setCurrentUser({ name: userName, id: userId });
      } else {
        setCurrentUser(null);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);
    window.location.href = '/';
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <div className={styles.leftSection}>
            {/* ВНЕШНЯЯ ССЫЛКА НА YOUTUBE */}
            <a
              href="https://www.youtube.com/watch?v=Cxmvq1MCR3c"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.logoLink}
            >
              <img src="/logo.png" alt="Logo" className={styles.logo} />
            </a>

            <Link to="/" className={styles.navItem}>Главное меню</Link>
            <Link to="/reviews/received" className={styles.navItem}>Мои отзывы</Link>
          </div>
          <div className={styles.rightSection}>
            {currentUser ? (
              <div className={styles.authButtons}>
                <Link to="/profile" className={styles.authButton}>
                  <FaUserCircle size={18} />
                  <span>Профиль</span>
                </Link>
                <button onClick={handleLogout} className={styles.authButton}>
                  <span>Выйти</span>
                </button>
              </div>
            ) : (
              <div className={styles.authButtons}>
                <button 
                  onClick={() => {
                    setAuthType('login');
                    setIsAuthModalOpen(true);
                  }} 
                  className={styles.authButton}
                >
                  <FaSignInAlt size={18} />
                  <span>Войти</span>
                </button>
                <button 
                  onClick={() => {
                    setAuthType('register');
                    setIsAuthModalOpen(true);
                  }} 
                  className={styles.authButton}
                >
                  <FaUserPlus size={18} />
                  <span>Регистрация</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        type={authType}
        onAuthSuccess={() => {
          const userName = localStorage.getItem('userName');
          const userId = localStorage.getItem('userId');
          if (userName && userId) {
            setCurrentUser({ name: userName, id: userId });
          }
        }}
        onSwitchType={() => setAuthType(prev => prev === 'login' ? 'register' : 'login')}
      />
    </header>
  );
};

export default Header;
