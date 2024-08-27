import { supabase } from "../utils/supabase";

export const submit = async (
  externalID: string,
  bookID: number,
  rating: number,
  review: string
) => {
  const user = await supabase
    .from("users")
    .select("id")
    .eq("externalID", externalID);

  if (!user.data || (user.data && !(user.data.length > 0))) {
    throw new Error("Error fetching user");
  }
  // Check that a user hasn't review this book before
  const { data: existingReviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("book", bookID)
    .eq("createdBy", user?.data?.[0].id);
  if (existingReviews && existingReviews.length > 0) {
    throw new Error("You've already submitted a review for this book");
  }
  await supabase.from("reviews").insert({
    book: bookID,
    rating: rating,
    review: review,
    createdBy: user?.data?.[0].id,
  });
};
