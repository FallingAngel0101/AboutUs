import React from "react";
import { User } from "/types/types";
import styles from "./UserCard.module.css";
import { useNavigate } from "react-router-dom";

interface UserCardProps {
  user: User;
  onLeaveReview: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onLeaveReview }) => {
  const navigate = useNavigate();

  const badgeStyles = {
    admin: { backgroundColor: "#f44336", color: "white" },
    premium: {
      backgroundColor: "#FFD700",
      color: "#333",
      textShadow: "0 0 1px rgba(0,0,0,0.3)",
    },
    regular: { backgroundColor: "#9E9E9E", color: "white" },
  };

  const handleViewProfile = () => {
    navigate(`/users/${user.id}`);
  };

const avatarUrl = user.photo?.startsWith("http")
  ? user.photo
  : `http://localhost:3000/${user.photo || "uploads/avatars/default.jpg"}`;


  return (
    <div className={styles.card}>
      <div className={styles.avatarSection}>
        <div className={styles.avatarFrame}>
          <img
            src={avatarUrl}
            alt={user.nickname}
            className={styles.avatar}
          />
          <span
            className={styles.badge}
            style={badgeStyles[user.type as keyof typeof badgeStyles]}
          >
            {user.type}
          </span>
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.actionButton} ${styles.reviewButton}`}
            onClick={onLeaveReview}
          >
            Оставить отзыв
          </button>
          <button
            className={`${styles.actionButton} ${styles.profileButton}`}
            onClick={handleViewProfile}
          >
            Профиль
          </button>
        </div>
      </div>

      <div className={styles.infoSection}>
        <h3 className={styles.infoTitle}>{user.nickname}</h3>

        <div className={styles.descriptionContainer}>
          <div className={styles.description}>
            {(user.description || "Нет описания")
              .split("\n")
              .map((line, index) => (
                <p key={index} className={styles.descriptionLine}>
                  {line}
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
