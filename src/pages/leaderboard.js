import Head from "next/head";
import clsx from "clsx";

import Header from "@/components/Header";
import { supabase } from "@/utils/supabaseClient";

export default function Leaderboard({ leaderboardData }) {
  const username = "the-creator";
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
        <div className="w-full">
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-gray-200/70">
                <th className="text-center font-semibold px-4 py-4 rounded-l-2xl">
                  #
                </th>
                <th className="text-center font-semibold px-4 py-4">
                  username
                </th>
                <th className="text-center font-semibold px-4 py-4 rounded-r-2xl">
                  correct words
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((user, index) => (
                <tr
                  key={index}
                  className={clsx(
                    "text-center",
                    user.username === username && "bg-lime-200 font-semibold"
                  )}
                >
                  <td
                    className={clsx(
                      "px-4 py-4",
                      user.username === username && "rounded-l-2xl"
                    )}
                  >
                    {index + 1}
                  </td>
                  <td className="px-4 py-4">{user.username}</td>
                  <td
                    className={clsx(
                      "px-4 py-4",
                      user.username === username && "rounded-r-2xl"
                    )}
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
    const sortedInputs = user.daily_inputs.sort(
      (a, b) => new Date(a.added_at) - new Date(b.added_at)
    );

    const correctWordsCount = sortedInputs.filter(
      (input) => input.correct === input.user
    ).length;

    let timeTaken = 1000000;
    if (sortedInputs.length >= 2) {
      const startTime = new Date(sortedInputs[0].added_at);
      const endTime = new Date(sortedInputs[sortedInputs.length - 1].added_at);
      timeTaken = endTime - startTime;
      //   console.log(timeTaken, "timeTaken", user.username, "username");
    }

    return { ...user, correctWordsCount, timeTaken };
  });

  leaderboardData.sort((a, b) => {
    if (a.correctWordsCount === b.correctWordsCount) {
      return a.timeTaken - b.timeTaken;
    }
    return b.correctWordsCount - a.correctWordsCount;
  });

  return {
    props: {
      leaderboardData,
    },
  };
}
