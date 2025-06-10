import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "../../ui/Carousel/Carousel";
import ReviewModal from "../../ReviewModal/ReviewModal";
import { User } from "../../../types/types";
import styles from './HomePage.module.css';
import UserCard from "../../ui/UserCard";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users", {
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Ошибка при получении пользователей");
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error("Ошибка загрузки:", err);
        setError("Не удалось загрузить пользователей");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const nextUser = () => {
    setCurrentIndex((prev) => (prev === users.length - 1 ? 0 : prev + 1));
  };

  const prevUser = () => {
    setCurrentIndex((prev) => (prev === 0 ? users.length - 1 : prev - 1));
  };

  const handleViewProfile = (userId: number) => {
    navigate(`/profile/${userId}`);
  };

  if (isLoading) {
    return <div className={styles.container}>Загрузка пользователей...</div>;
  }

  if (error) {
    return <div className={styles.container}>Ошибка: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.carousel}>
        <button onClick={prevUser} className={styles.carouselButton}>←</button>

        {users.length > 0 && (
          <div className={styles.cardWrapper}>
            <UserCard 
              user={users[currentIndex]} 
              onLeaveReview={() => {
                setSelectedUserId(users[currentIndex].id);
                setIsModalOpen(true);
              }}
             
            />
          </div>
        )}

        <button onClick={nextUser} className={styles.carouselButton}>→</button>
      </div>

      {isModalOpen && selectedUserId && (
        <ReviewModal
          userId={selectedUserId}
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (review) => {
            try {
              const token = localStorage.getItem('token');

              const response = await fetch('http://localhost:3000/reviews', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  comment: review.text,               
                  rating: review.rating,                        
                  targetUserId: selectedUserId,       
                })
              });

              if (!response.ok) throw new Error('Ошибка при отправке');
              
            
              toast.success('Отзыв успешно отправлен!');
              
            } catch (err) {
             
              toast.error('Не удалось отправить отзыв');
              console.error(err);
            } finally {
              setIsModalOpen(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default HomePage;