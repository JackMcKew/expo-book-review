import { Book } from "../types";
import { getUser, insertBook, supabase } from "../utils/supabase";

export const submit = async (
  externalID: string,
  bookTitle: string,
  author: string
) => {
  const user = await getUser(externalID);

  if (!user.data || (user.data && !(user.data.length > 0))) {
    throw new Error("Error fetching user");
  }

  await insertBook(user?.data?.[0].id, bookTitle, author);
};

export const fetch = async (): Promise<Book[]> => {
  const { data } = await supabase
    .from("books")
    .select(`id, title, author, reviews(*)`);
  return data as Book[];
};
