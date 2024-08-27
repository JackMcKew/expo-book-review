// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BookListScreen from '../screens/BookListScreen';

export type RootStackParamList = {
  BookList: undefined;
  AddBook: undefined;
  BookDetails: { bookId: number };
  AddReview: { bookId: number };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="BookList">
      <Stack.Screen name="BookList" component={BookListScreen} options={{ title: 'Books' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
