import { supabase } from "../utils/supabase";

export const upsert = async (externalID: string) => {
  const user = await supabase
    .from("users")
    .select("id")
    .eq("externalID", externalID);
  if (user.data && user.data.length > 0) {
    await supabase
      .from("users")
      .upsert({ id: user.data[0].id, externalID: externalID }); // Create a new user if one doesn't exist
  } else {
    await supabase.from("users").upsert({ externalID: externalID }); // Create a new user if one doesn't exist
  }
};
