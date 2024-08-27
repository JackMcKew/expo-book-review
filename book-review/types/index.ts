// src/types/index.ts

export interface Book {
  id: number;
  title: string;
  author: string;
  reviews: Review[];
}

export interface Review {
  id: number;
  rating: number;
  text: string;
}
