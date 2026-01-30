import { createClient } from "./server";

export const getUser = async () => {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  return user;
};
