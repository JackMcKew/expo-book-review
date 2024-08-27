// src/types/index.ts

export interface Book {
  id: number;
  userId: number;
  title: string;
  author: string;
  reviews: Review[];
}

export interface Review {
  id: number;
  userId: number;
  rating: number;
  text: string;
}
