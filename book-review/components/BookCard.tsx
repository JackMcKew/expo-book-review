// src/components/BookCard.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onPress: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onPress }) => (
  <Card style={styles.card} onPress={onPress}>
    <Card.Content>
      <Title>{book.title}</Title>
      <Paragraph>{book.author}</Paragraph>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
});

export default BookCard;
