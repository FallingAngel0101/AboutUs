import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./UserProfilePage.module.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";


interface ReviewAuthor {
  id: number;
  name: string;
  nickname?: string;
  photoUrl?: string | null;
}

interface Review {
  id: number;
  comment: string;
  rating: number;
  createdAt: string;
  author: ReviewAuthor;
}

interface UserProfile {
  id: number;
  name: string;

  email: string;
  description: string;
  photoUrl: string | null;
  type: string;
  createdAt?: string;
  updatedAt?: string;
  rating: number;
  totalReviews: number;
  reviews?: Review[]; // Теперь используем reviews вместо receivedReviews
}

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/users/${userId}`);

        if (!response.ok) {
          if (response.status === 404) {
            navigate("/not-found");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: UserProfile = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("User profile fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, navigate]);

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!userData) {
    return <div className={styles.error}>User not found</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
       
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          Back
        </button>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.avatarSection}>
          {userData.photoUrl ? (
            <img
              src={`http://localhost:3000/${userData.photoUrl}`}
              alt={`${userData.name}'s avatar`}
              className={styles.avatarImage}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {userData.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className={styles.infoSection}>
          <h2>{userData.name}</h2>

          {userData.type && (
            <span
              className={styles.badge}
              style={{
                backgroundColor:
                  userData.type === "admin" ? "red" :
                  userData.type === "premium" ? "gold" : "gray",
              }}
            >
              {userData.type}
            </span>
          )}

          {userData.description && (
            <div className={styles.description}>
              <h3>About</h3>
              <p>{userData.description}</p>
            </div>
          )}

          <div className={styles.meta}>
  <div className={styles.starsBlock}>
    <div className={styles.stars}>
      {Array.from({ length: 5 }).map((_, i) => {
        const ratingValue = i + 1;
        if (userData.rating >= ratingValue) {
          return <FaStar key={i} color="#ffc107" />;
        } else if (userData.rating >= ratingValue - 0.5) {
          return <FaStarHalfAlt key={i} color="#ffc107" />;
        } else {
          return <FaRegStar key={i} color="#ffc107" />;
        }
      })}
    </div>
    <span className={styles.ratingValue}>
      {userData.rating.toFixed(1)}
    </span>
    <span className={styles.totalReviews}>
      {userData.totalReviews} оценок
    </span>
  </div>

  {userData.createdAt && (
    <p>На сайте с {new Date(userData.createdAt).toLocaleDateString()}</p>
  )}
</div>
        </div>
      </div>

      {userData.reviews && userData.reviews.length > 0 ? (
        <div className={styles.reviewSection}>
          <h3 className={styles.reviewsTitle}>Отзывы пользователя</h3>
          <div className={styles.reviewGrid}>
            {userData.reviews.map((review) => (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <img
  src={
    review.author.photoUrl
      ? `http://localhost:3000/${review.author.photoUrl}`
      : `http://localhost:3000/uploads/avatars/default.jpg`
  }
  alt={`${review.author.name}'s avatar`}
  className={styles.reviewAuthorAvatar}
/>


                  <div className={styles.reviewAuthorInfo}>
                    <span className={styles.reviewAuthorName}>
                      {review.author.name}
                    </span>
                    <span className={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {Array.from({ length: 5 }).map((_, i) => {
                      const ratingValue = i + 1;
                      if (review.rating >= ratingValue) {
                        return <FaStar key={i} color="#ffc107" />;
                      } else if (review.rating >= ratingValue - 0.5) {
                        return <FaStarHalfAlt key={i} color="#ffc107" />;
                      } else {
                        return <FaRegStar key={i} color="#ffc107" />;
                      }
                    })}
                  </div>
                  <span style={{ fontWeight: "bold" }}>{review.rating.toFixed(1)}</span>
                </div>

                </div>
                <div className={styles.reviewComment}>
                  <p>{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.noReviews}>No reviews yet</div>
      )}
    </div>
  );
};

export default UserProfilePage;