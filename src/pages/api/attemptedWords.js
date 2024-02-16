import { supabase } from "@/utils/supabaseClient";

export default async function handler(req, res) {
  const { userId } = req.query;

  if (req.method === "GET" && userId) {
    try {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("spellol_users")
        .select("daily_inputs")
        .eq("id", userId)
        .eq("daily_date", today);

      if (error) throw error;
      console.log(data[0].daily_inputs);
      let attemptedWords = [];
      const dailyInputs = data[0].daily_inputs;
      if (dailyInputs) {
        attemptedWords = dailyInputs.map((input) => ({
          correct: input.correct,
          input: input.input,
        }));
      }
      console.log(attemptedWords);
      res.status(200).json(attemptedWords);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ message: "User ID is required" });
  }
}
