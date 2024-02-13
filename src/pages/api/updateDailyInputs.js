import { supabase } from "@/utils/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { userId, input, correct } = req.body;
      console.log(userId, input, correct);

      if (!userId || !input || !correct) {
        return res.status(400).json({ error: "Missing user ID or word" });
      }

      // Get the current UTC date and time
      const currentUTCDate = new Date().toISOString().split("T")[0];
      const currentTime = new Date().toISOString();

      // Retrieve the current daily_inputs and daily_date for the user
      let { data: userData, error: userError } = await supabase
        .from("spellol_users")
        .select("daily_inputs, daily_date")
        .eq("id", userId)
        .single();

      if (userError) {
        throw userError;
      }

      let updatedDailyInputs;
      if (userData.daily_date === currentUTCDate && userData.daily_inputs) {
        updatedDailyInputs = [
          ...userData.daily_inputs,
          { input, correct, added_at: currentTime },
        ];
      } else {
        updatedDailyInputs = [{ input, correct, added_at: currentTime }];
      }

      const { data, error } = await supabase
        .from("spellol_users")
        .update({
          daily_inputs: updatedDailyInputs,
          daily_date: currentUTCDate,
        })
        .eq("id", userId);

      // Handle any errors
      if (error) {
        throw error;
      }

      // Send back the updated data
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    // Handle any non-POST requests
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
