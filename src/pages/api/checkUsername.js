import { supabase } from "@/utils/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";
import { isMessageDirty } from "profanity-hindi";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username } = req.body;
    console.log(username);

    // Profanity check
    const matcher = new RegExpMatcher({
      ...englishDataset.build(),
      ...englishRecommendedTransformers,
    });
    const isProfaneEn = matcher.hasMatch(username);
    const isProfaneHi = isMessageDirty(username);

    if (isProfaneEn || isProfaneHi) {
      return res.status(400).json({ message: "profane" });
    }

    try {
      let { data, error } = await supabase
        .from("spellol_users")
        .select("username")
        .eq("username", username)
        .single();

      if (error && !error.details.startsWith("Results contain 0 rows")) {
        throw error;
      }

      if (data) {
        return res.status(409).json({ message: "Username already exists" });
      } else {
        const userId = uuidv4();

        await supabase.from("spellol_users").insert([
          {
            id: userId,
            username,
          },
        ]);

        return res.status(200).json({ userId, username });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
