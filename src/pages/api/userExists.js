import { supabase } from "@/utils/supabaseClient";

export default async function handler(req, res) {
  const { userId } = req.query;
  console.log(userId);
  if (req.method === "GET" && userId) {
    try {
      const { data, error } = await supabase
        .from("spellol_users")
        .select("username")
        .eq("id", userId)
        .single();

      if (error) throw error;
      res.status(200).json({ userExists: data ? true : false });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ message: "User ID is required" });
  }
}
