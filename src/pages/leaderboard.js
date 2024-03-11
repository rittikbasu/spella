import Head from "next/head";

import Header from "@/components/Header";
import { supabase } from "@/utils/supabaseClient";

export default function Leaderboard({ leaderboardData }) {
  return (
    <>
      <Head>
        <title>spellol - leaderboard</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <div className="max-w-xl md:py-8 px-2 pt-4 h-dvh w-dvw flex flex-col mx-auto">
        <Header />
        <h1 className="text-2xl md:text-4xl font-bold text-center my-4">
          leaderboard
        </h1>
        <div className="w-full rounded-2xl">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="text-center font-semibold px-4 py-4 bg-gray-200/40 rounded-tl-2xl">
                  #
                </th>
                <th className="text-center font-semibold px-4 py-4 bg-amber-200/40">
                  username
                </th>
                <th className="text-center font-semibold px-4 py-4 bg-black/50 text-gray-200 rounded-tr-2xl">
                  correct words
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((user, index) => (
                <tr key={index} className="text-center">
                  <td
                    className={`px-4 py-4 ${
                      user.username === "xanthine-void"
                        ? "bg-lime-200 font-semibold text-black"
                        : "bg-gray-200/40"
                    } ${
                      index === leaderboardData.length - 1
                        ? "rounded-bl-2xl"
                        : ""
                    }`}
                  >
                    {index + 1}
                  </td>
                  <td
                    className={`px-4 py-4 ${
                      user.username === "xanthine-void"
                        ? "bg-lime-200 font-semibold text-black"
                        : "bg-amber-200/50"
                    }`}
                  >
                    {user.username}
                  </td>
                  <td
                    className={`px-4 py-4 ${
                      user.username === "xanthine-void"
                        ? "bg-lime-200 font-semibold text-black"
                        : "text-gray-200 bg-black/50"
                    } ${
                      index === leaderboardData.length - 1
                        ? "rounded-br-2xl"
                        : ""
                    }`}
                  >
                    {user.correctWordsCount} / 10
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("spellol_users")
    .select("id, username, daily_inputs")
    .not("daily_inputs", "is", null);
  // .eq("daily_date", today)
  const leaderboardData = data.map((user) => {
    const correctWordsCount = user.daily_inputs.filter(
      (input) => input.correct
    ).length;
    return { ...user, correctWordsCount };
  });

  leaderboardData.sort((a, b) => b.correctWordsCount - a.correctWordsCount);

  return {
    props: {
      leaderboardData,
    },
  };
}
