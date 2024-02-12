import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { words } = req.body;
    console.log(words);
    try {
      for (const word of words) {
        await supabase.rpc("increment_spellol_reports", {
          word_to_increment: word,
        });
      }
      return res
        .status(200)
        .json({ message: "Reports count updated successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
