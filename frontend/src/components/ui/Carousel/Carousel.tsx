import React, { useState, useEffect } from "react";
import UserCard from "../../../components/ui/UserCard/userCard";
import { User } from "../../../types/types";
import styles from "./Carousel.module.css";

interface CarouselProps {
  users: User[];
  onLeaveReview: (userId: number) => void;
}

const Carousel: React.FC<CarouselProps> = ({ users }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const nextSlide = () => {
    if (isAnimating) return;
    setDirection("right");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === users.length - 1 ? 0 : prev + 1));
      setIsAnimating(false);
    }, 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setDirection("left");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? users.length - 1 : prev - 1));
      setIsAnimating(false);
    }, 500);
  };

  // Автопрокрутка каждые 5 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, isAnimating]);

  return (
    <div className={styles.carousel}>
      <button
        className={styles.button}
        onClick={prevSlide}
        disabled={isAnimating}
      >
        ←
      </button>

      <div className={styles.content}>
        <div
          className={`${styles.userCard} ${
            isAnimating
              ? direction === "right"
                ? styles.next
                : styles.prev
              : ""
          }`}
          key={currentIndex}
        >
          <UserCard
            user={users[currentIndex]}
            onLeaveReview={() => console.log("Review")}
          />
        </div>
      </div>

      <button
        className={styles.button}
        onClick={nextSlide}
        disabled={isAnimating}
      >
        →
      </button>
      <div className={styles.indicators}>
        {users.map((_, index) => (
          <div
            key={index}
            className={`${styles.indicator} ${
              currentIndex === index ? styles.active : ""
            }`}
            onClick={() => {
              if (!isAnimating && currentIndex !== index) {
                setDirection(index > currentIndex ? "right" : "left");
                setIsAnimating(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsAnimating(false);
                }, 500);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
