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
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { fetch, submit } from "../services/books";
import { upsert } from "../services/users";

// Initialize an agent at application startup.
const fpPromise = FingerprintJS.load();

type BookListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "BookList"
>;

interface Props {
  navigation: BookListScreenNavigationProp;
}

const BookListScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [externalID, setExternalID] = useState<string>("");

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  const [errorText, setErrorText] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const textInputStyle = {
    height: 40,
    marginBottom: 15,
    backgroundColor: theme.colors.background,
    width: 250,
  };

  const submitBook = async (bookTitle: string, author: string) => {
    try {
      await submit(externalID, bookTitle, author);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorText(err.message);
      }
    }
    await fetchBooks();
    hideModal();
  };

  const fetchBooks = async () => {
    try {
      const books = await fetch();
      setBooks(books);
    } catch (error) {
      setErrorText("Error fetching book");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    (async () => {
      // Get the visitor identifier when you need it.
      const fp = await fpPromise;
      const result = await fp.get();
      //   User not found, create
      await upsert(result.visitorId);
      setExternalID(result.visitorId);
    })();
  }, []);

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
            {errorText && (
              <Text style={{ color: "red", marginBottom: 15 }}>
                We faced an error submitting your book :(
              </Text>
            )}
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
            <FAB
              style={styles.submitFAB}
              icon="check"
              label="Submit book"
              onPress={() => submitBook(bookTitle, author)}
            />
          </Modal>
        </Portal>
        <FlatList
          data={books}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <BookCard
              book={item}
              externalID={externalID}
              updateParent={fetchBooks}
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
    paddingBottom: 160,
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
  submitFAB: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});

export default BookListScreen;
