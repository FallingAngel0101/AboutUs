import React, { useEffect, useState } from 'react';
import styles from './MyReviewsPage.module.css';
import { getReceivedReviews } from '../../../services/reviewService';
import { Review } from '../../../types/types';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const MyReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'high' | 'low' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    getReceivedReviews()
      .then(setReviews)
      .catch(() => setError("Ошибка загрузки отзывов или вы не авторизованы"));
  }, [navigate]);

  // Рассчитываем средний рейтинг и количество отзывов
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const totalReviews = reviews.length;

  const sortedReviews = [...reviews];
  if (sortOrder === 'high') {
    sortedReviews.sort((a, b) => b.rating - a.rating);
  } else if (sortOrder === 'low') {
    sortedReviews.sort((a, b) => a.rating - b.rating);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Мои отзывы</h1>

      {/* Добавляем блок с общей статистикой */}
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}></span>
          <div className={styles.stars}>
            {Array.from({ length: 5 }).map((_, i) => {
              const ratingValue = i + 1;
              if (Number(averageRating) >= ratingValue) {
                return <FaStar key={i} color="#ffc107" />;
              } else if (Number(averageRating) >= ratingValue - 0.5) {
                return <FaStarHalfAlt key={i} color="#ffc107" />;
              } else {
                return <FaRegStar key={i} color="#ffc107" />;
              }
            })}
          </div>
          <span className={styles.ratingValue}>{averageRating}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.totalReviews}>{totalReviews}</span>
          <span className={styles.summaryLabel}>оценок</span>
        </div>
      </div>

      <div className={styles.sortButtons}>
        <button
          className={`${styles.sortButton} ${sortOrder === 'high' ? styles.active : ''}`}
          onClick={() => setSortOrder('high')}
        >
          Сначала положительные
        </button>
        <button
          className={`${styles.sortButton} ${sortOrder === 'low' ? styles.active : ''}`}
          onClick={() => setSortOrder('low')}
        >
          Сначала отрицательные
        </button>
      </div>

      {error && <p className={styles.emptyMessage}>{error}</p>}

      <div className={styles.reviewsList}>
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.stars}>
                  {Array.from({ length: 5 }).map((_, i) => {
                    const value = i + 1;
                    if (review.rating >= value) return <FaStar key={i} color="#ffc107" />;
                    else if (review.rating >= value - 0.5) return <FaStarHalfAlt key={i} color="#ffc107" />;
                    else return <FaRegStar key={i} color="#ffc107" />;
                  })}
                </div>
                <span className={styles.ratingValue}>{review.rating.toFixed(1)}</span>
                <span className={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className={styles.reviewComment}>
                <p>{review.comment}</p>
              </div>
              

              {review.author?.name && (
                <div className={styles.reviewAuthor}>
                  Автор:{' '}
                  {review.author.id ? (
                    <a href={`/users/${review.author.id}`}>{review.author.name}</a>
                  ) : (
                    review.author.name
                  )}
                </div>
              )}
            </div>
          ))
        ) : !error ? (
          <p className={styles.emptyMessage}>У вас пока нет отзывов</p>
        ) : null}
      </div>
    </div>
  );
};

export default MyReviewsPage;

