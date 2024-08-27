// src/screens/BookListScreen.tsx
import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import {
  FAB,
  Modal,
  PaperProvider,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Book } from "../types";
import BookCard from "../components/BookCard";
import api from "../services/api";

type BookListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "BookList"
>;

interface Props {
  navigation: BookListScreenNavigationProp;
}

const BookListScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [books, setBooks] = useState<Book[]>([
    {
      id: 1,
      title: "Huckleberry Finn",
      author: "Mark Twain",
    },
    {
      id: 2,
      title: "Moby Dick",
      author: "Big Dave",
    },
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const containerStyle = {};
  const textInputStyle = {
    height: 40,
    marginBottom: 15,
    backgroundColor: theme.colors.background,
    // padding: 10,
    width: 250,
  };

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchBooks);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
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
              Add a new book for others to review
            </Text>
            <TextInput
              mode="outlined"
              style={textInputStyle}
              label={"Book title"}
              value={bookTitle}
              onChangeText={(text) => setBookTitle(text)}
            />
            <TextInput
              mode="outlined"
              style={textInputStyle}
              label={"Author"}
              value={author}
              onChangeText={(text) => setAuthor(text)}
            />
          </Modal>
        </Portal>
        <FlatList
          data={books}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <BookCard
              book={item}
              onPress={() =>
                navigation.navigate("BookDetails", { bookId: item.id })
              }
            />
          )}
          contentContainerStyle={styles.list}
        />
        <FAB style={styles.fab} icon="plus" onPress={() => showModal()} />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingBottom: 80,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
});

export default BookListScreen;
