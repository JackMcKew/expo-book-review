// src/types/index.ts

export interface Book {
    id: number;
    title: string;
    author: string;
  }
  
  export interface Review {
    id: number;
    rating: number;
    text: string;
    userId: number;
    bookId: number;
  }
  