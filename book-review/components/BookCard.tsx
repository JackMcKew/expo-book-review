// src/components/BookCard.tsx
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Title, Paragraph, Button, Text } from "react-native-paper";
import { Book } from "../types";
import { FontAwesome } from "@expo/vector-icons";

interface BookCardProps {
  book: Book;
  onPress: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onPress }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <Title>{book.title}</Title>
        <Paragraph>{book.author}</Paragraph>
        <Button onPress={handleToggleExpand}>
          {expanded ? "Show Less" : "Show More"}
        </Button>
        {expanded && (
          <View style={styles.textBlocksContainer}>
            {book.reviews.map(({ text, rating }, index) => (
              <div style={{ display: "flex" }}>
                {/* For each rating show a</div> star */}
                <div style={{ width: "150px" }}>
                  {Array.from({ length: rating }, (_, index) => (
                    <FontAwesome
                      key={index}
                      name="star"
                      size={18}
                      color="yellow"
                      style={{ marginRight: 5 }}
                    />
                  ))}
                  {Array.from({ length: 5 - rating }, (_, index) => (
                    <FontAwesome
                      key={index}
                      name="star-o"
                      size={18}
                      color="yellow"
                      style={{ marginRight: 5 }}
                    />
                  ))}

                </div>

                <Text key={index} style={styles.textBlock}>
                  {text}
                </Text>
              </div>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  textBlocksContainer: {
    marginTop: 10,
  },
  textBlock: {
    marginBottom: 5,
    fontSize: 14,
  },
});

export default BookCard;
