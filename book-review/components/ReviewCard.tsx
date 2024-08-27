// src/components/ReviewCard.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Paragraph, Caption } from 'react-native-paper';
import { Review } from '../types';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => (
  <Card style={styles.card}>
    <Card.Content>
      <Paragraph>{review.text}</Paragraph>
      <Caption>Rating: {review.rating}/5</Caption>
      <Caption>User ID: {review.userId}</Caption>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
});

export default ReviewCard;
