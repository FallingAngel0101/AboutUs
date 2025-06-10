import React from 'react';
import styles from './ReviewCard.module.css';
import { useNavigate } from 'react-router-dom';

interface ReviewCardProps {
  productName: string;
  rating: number;
  comment: string;
  createdAt: string;
  author?: string;
  authorId?: number;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  productName,
  rating,
  comment,
  createdAt,
  author,
  authorId
}) => {
  const navigate = useNavigate();

  const handleAuthorClick = () => {
    if (authorId) {
      navigate(`/users/${authorId}`);
    }
  };

  const formattedDate = new Date(createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        {author && (
          <button onClick={handleAuthorClick} className={styles.authorButton}>
            {author}
          </button>
        )}
      </div>

      <div className={styles.ratingRow}>
        <div className={styles.ratingStars}>
          {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
        </div>
        <div className={styles.date}>{formattedDate}</div>
      </div>

      <p className={styles.comment}>{comment}</p>
    </div>
  );
};

export default ReviewCard;
