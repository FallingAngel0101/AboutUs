// Явно экспортируйте типы
/*export interface User {
  id: number;
  nickname: string;
  photo: string;
  description: string;
}*/

export interface Review {
  id: number;
  productName: string;
  comment: string;
  rating: number;
  createdAt: string;
  author?: {
    id: number;
    name: string;
  };
}

export interface User {
  id: number;
  nickname: string;
  photo: string;
  description: string;
  type: UserType; // Добавьте это свойство
}

export type UserType = 'default' | 'admin' | 'premium';