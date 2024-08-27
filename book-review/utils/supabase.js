import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const getUser = async (externalID) => {
  return supabase.from("users").select("*").eq("external_id", externalID);
};

export const insertBook = async (userID, title, author) => {
  return supabase.from("books").insert({
    title: title,
    author: author,
    createdBy: userID,
  });
};
