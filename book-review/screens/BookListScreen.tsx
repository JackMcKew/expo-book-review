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
import { supabase } from "../utils/supabase";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

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
  (async () => {
    // Get the visitor identifier when you need it.
    const fp = await fpPromise;
    const result = await fp.get();
    await supabase.from("users").upsert({ externalID: result.visitorId }); // Create a new user if one doesn't exist
    console.log(result.visitorId);
    setExternalID(result.visitorId);
  })();
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
    const user = await supabase
      .from("users")
      .select("id")
      .eq("externalID", externalID);

    if (!user.data || (user.data && !(user.data.length > 0))) {
      setErrorText("Error fetching user");
    }
    await supabase.from("books").insert({
      title: bookTitle,
      author: author,
      createdBy: user?.data?.[0].id,
    });
    await fetchBooks();
    hideModal();

  };

  const fetchBooks = async () => {
    try {
      const { data } = await supabase
        .from("books")
        .select(`id, title, author, reviews(*)`);
      console.log(data);
      setBooks(data as Book[]);
    } catch (error) {
      console.error("Error fetching books: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
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
        {books && (
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
        )}
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
  submitFAB: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});

export default BookListScreen;
