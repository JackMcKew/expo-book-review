// src/components/BookCard.tsx
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  FAB,
  Portal,
  Modal,
  useTheme,
  TextInput,
} from "react-native-paper";
import { Book } from "../types";
import { FontAwesome } from "@expo/vector-icons";

interface BookCardProps {
  book: Book;
  onPress: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onPress }) => {
  const [expanded, setExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState("1");
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  const [errorText, setErrorText] = useState("");
  const theme = useTheme();

  const handleSetRating = (rating: string) => {
    let updatedRating = rating.replace(/[^0-9]/g, "");
    if (Number(updatedRating) > 5 || Number(updatedRating) < 1) {
      setErrorText("The rating must be between 1 and 5.");
      setRating("")
      return;
    }
    setRating(updatedRating);
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const submitReview = async (rating: number, review: string) => {
    // Check that a user hasn't review this book before
    setErrorText("We faced an error submitting your review :(");
  };

  const textInputStyle = {
    height: 40,
    marginBottom: 15,
    backgroundColor: theme.colors.background,
    width: 250,
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <Title>{book.title}</Title>
        <Paragraph>{book.author}</Paragraph>
        <Button onPress={handleToggleExpand}>
          {expanded ? "Show Less" : "Show More"}
        </Button>
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={hideModal}
            contentContainerStyle={{
              backgroundColor: theme.colors.background,
              padding: 100,
              alignSelf: "center",
              borderRadius: 32,
            }}
          >
            <Text variant="titleLarge" style={{ marginBottom: 15 }}>
              Add a review for {book.title}
            </Text>
            {errorText && (
              <Text style={{ color: "red", marginBottom: 15 }}>
                {errorText}
              </Text>
            )}
            <TextInput
              mode="outlined"
              style={textInputStyle}
              keyboardType="numeric"
              label={"Book rating"}
              value={`${rating}`}
              onChangeText={(text) => handleSetRating(`${text}`)}
            />
            <TextInput
              mode="outlined"
              style={textInputStyle}
              label={"Review"}
              value={reviewText}
              onChangeText={(text) => setReviewText(text)}
            />
            <FAB
              style={styles.submitFAB}
              icon="check"
              label="Submit review"
              onPress={() => submitReview(Number(rating), reviewText)}
            />
          </Modal>
        </Portal>
        {expanded && (
          <View style={styles.textBlocksContainer}>
            {book.reviews.map(({ text, rating }, index) => (
              <View style={{ flex: 1, flexDirection: "row" }}>
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
                <Text key={index} style={styles.textBlock}>
                  {text}
                </Text>
              </View>
            ))}
            <FAB
              style={styles.fab}
              icon="plus"
              label="Add review"
              onPress={() => showModal()}
            />
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
    marginBottom: 20,
  },
  textBlock: {
    marginBottom: 5,
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    right: 16,
    top: -6,
  },
  submitFAB: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});

export default BookCard;
