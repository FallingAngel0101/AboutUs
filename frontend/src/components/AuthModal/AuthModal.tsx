import React, { useState } from "react";
import styles from "./AuthModal.module.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "login" | "register";
  onAuthSuccess: () => void;
  onSwitchType: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  type,
  onAuthSuccess,
  onSwitchType,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = "http://localhost:3000";

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      let response;
      
      if (type === "register") {
        // Регистрация нового пользователя
        response = await fetch(`${API_URL}/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Registration failed");
        }

        // После успешной регистрации - автоматический вход
        response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
      } else {
        // Обычный вход
        response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Authentication failed");
      }

      const { access_token, user } = await response.json();

      // Сохраняем данные в localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("userId", user.id.toString());
      localStorage.setItem("userName", user.name || name);
      localStorage.setItem("userEmail", user.email);

      // Очищаем форму и закрываем модалку
      clearForm();
      onAuthSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication error");
      console.error("Auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <h2>{type === "login" ? "Вход" : "Регистрация"}</h2>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {type === "register" && (
            <div className={styles.formGroup}>
              <label>Имя</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Введите ваше имя"
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@mail.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Не менее 6 символов"
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Загрузка..." : type === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

        <div className={styles.switchAuth}>
          {type === "login" ? (
            <span>
              Нет аккаунта?{" "}
              <button type="button" onClick={onSwitchType}>
                Зарегистрироваться
              </button>
            </span>
          ) : (
            <span>
              Уже есть аккаунт?{" "}
              <button type="button" onClick={onSwitchType}>
                Войти
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;