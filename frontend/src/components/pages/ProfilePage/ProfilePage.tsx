import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaSave, FaTimes, FaSpinner, FaCamera } from "react-icons/fa";
import styles from "./ProfilePage.module.css";

interface UserData {
  id: number;
  name: string;
  description: string;
  photoURL: string | null;
  photoFile: File | null;
}

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        navigate("/login");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          navigate("/login");
          return;
        }

        const data = await response.json();
        setUserData({
          id: data.id,
          name: data.name,
          description: data.description || "",
          photoURL: data.photoUrl || null,
          photoFile: null,
        });
        setPreview(
          data.photoUrl
            ? `http://localhost:3000/${data.photoUrl}`
            : ""
        );
      } catch (err) {
        setError("Failed to load profile");
        console.error("Profile error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.match("image.*")) {
        setError("Пожалуйста, загрузите файл изображения (JPEG, PNG)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Размер файла должен быть меньше 5MB");
        return;
      }

      setUserData({ ...userData!, photoFile: file });
      setError(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!userData) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        navigate("/login");
        return;
      }

      if (userData.photoFile) {
        const formData = new FormData();
        formData.append("photo", userData.photoFile);

        const uploadResponse = await fetch(
          `http://localhost:3000/users/${userId}/photo`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error("Ошибка при загрузке фотографии");
        }

        const uploadData = await uploadResponse.json();
        const newPhotoURL = uploadData.photoURL || uploadData.photoUrl;
        if (newPhotoURL) {
          setPreview(`http://localhost:3000/${newPhotoURL}`);
          setUserData((prev) => ({
            ...prev!,
            photoURL: newPhotoURL,
            photoFile: null,
          }));
        }
      }


      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: userData.description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Ошибка при обновлении профиля");
      }

      const updatedUser = await response.json();
      setUserData((prev) => ({
        ...prev!,
        description: updatedUser.description,
        photoURL: updatedUser.photoUrl || prev?.photoURL,
        photoFile: null,
      }));

      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err);
      setError(
        err instanceof Error ? err.message : "Ошибка при обновлении профиля"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !userData) {
    return <div className={styles.loading}>Загрузка профиля...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!userData) {
    return <div className={styles.errorContainer}>Профиль не найден</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Мой профиль</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className={styles.editButton}
            disabled={isLoading}
          >
            <FaEdit /> Редактировать
          </button>
        ) : (
          <div className={styles.buttonGroup}>
            <button
              onClick={handleSave}
              className={`${styles.button} ${styles.saveButton}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <FaSpinner className={styles.spinner} />
              ) : (
                <FaSave />
              )}
              Сохранить
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className={`${styles.button} ${styles.cancelButton}`}
              disabled={isLoading}
            >
              <FaTimes /> Отмена
            </button>
          </div>
        )}
      </div>

      <div className={styles.profileContent}>
        <div className={styles.avatarContainer}>
          {preview ? (
            <img src={preview} alt="Аватар" className={styles.avatarImage} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {userData.name.charAt(0).toUpperCase()}
            </div>
          )}

          {isEditing && (
            <div className={styles.avatarControls}>
              <label htmlFor="avatar-upload" className={styles.uploadButton}>
                <FaCamera /> {userData.photoURL ? "Изменить" : "Добавить фото"}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              {preview && userData.photoFile && (
                <button
                  className={styles.removePhotoButton}
                  onClick={() => {
                    setPreview(
                      userData?.photoURL
                        ? `http://localhost:3000/${userData.photoURL}`
                        : ""
                    );
                    setUserData({ ...userData, photoFile: null });
                  }}
                >
                  Удалить
                </button>
              )}
            </div>
          )}
        </div>


        <div className={styles.infoSection}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Имя</label>
            <div className={styles.nameDisplay}>{userData.name}</div>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Обо мне</label>
            {isEditing ? (
              <textarea
                value={userData.description}
                onChange={(e) =>
                  setUserData({ ...userData, description: e.target.value })
                }
                className={styles.descriptionInput}
                rows={5}
                placeholder="Расскажите о себе..."
              />
            ) : (
              <div className={styles.descriptionValue}>
                {userData.description || "Нет описания"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
