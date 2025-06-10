import React, { useState } from "react";
import styles from "./ReviewModal.module.css";
import { FaStar } from "react-icons/fa";

interface ReviewModalProps {
  userId: number;
  onClose: () => void;
  onSubmit: (review: { text: string; isAnonymous: boolean; rating: number }) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ userId, onClose, onSubmit }) => {
  const [text, setText] = useState("");
  const [isAnonymous, _setIsAnonymous] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  const handleSubmit = () => {
    onSubmit({ text, isAnonymous, rating });
  };

  const renderStars = () => {
    return (
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={28}
            style={{ cursor: "pointer", transition: "color 0.2s" }}
            color={hover !== null ? (star <= hover ? "#ffc107" : "#e4e5e9") : (star <= rating ? "#ffc107" : "#e4e5e9")}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Отзыв для пользователя #{userId}</h3>
        {renderStars()}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={styles.textarea}
          placeholder="Напишите отзыв..."
        />
        <div className={styles.button}>
          <button onClick={handleSubmit}>Отправить</button>
          <button onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
