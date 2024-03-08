import { supabase } from "@/utils/supabaseClient";
import { generateUsername } from "@/utils/generateUsername";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { user_id, inputLog } = req.body;

      if (!user_id || !inputLog) {
        return res.status(400).json({ error: "Missing user ID or word" });
      }

      const currentUTCDate = new Date().toISOString().split("T")[0];

      // Check if user exists
      let { data: userExists, error: userExistsError } = await supabase
        .from("spellol_users")
        .select("id")
        .eq("id", user_id)
        .single();

      if (!userExists) {
        const username = await generateUsername();
        console.log(username, "username");

        const { error: insertUserError } = await supabase
          .from("spellol_users")
          .insert({
            id: user_id,
            username: username,
            daily_date: currentUTCDate,
            daily_inputs: inputLog,
          });

        res.status(200).json({ message: "User inputs updated successfully" });

        if (insertUserError) {
          throw insertUserError;
        }
      } else {
        const { data, error: insertUserError } = await supabase
          .from("spellol_users")
          .update({ daily_date: currentUTCDate, daily_inputs: inputLog })
          .eq("id", user_id)
          .select();
        console.log(data, "data");
        if (insertUserError) {
          throw insertUserError;
        }
      }
      res.status(200).json({ message: "User inputs updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    // Handle any non-POST requests
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
