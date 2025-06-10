import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate(); // для перенаправления после логина

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // для блокировки кнопки

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);

      console.log('Успешный вход:', response.data);

      navigate('/');
    } catch (err: any) {
      console.error('Ошибка входа:', err);
      setError(
        err?.response?.data?.message || 'Ошибка авторизации. Проверьте данные.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Вход</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          required
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Входим...' : 'Войти'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;