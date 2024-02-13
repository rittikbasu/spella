import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import { FaArrowRightLong } from "react-icons/fa6";
import { toast, Toaster } from "sonner";

export default function Signup() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/checkUsername", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Signing up with:", username);
      localStorage.setItem(
        "user",
        JSON.stringify({ id: data.userId, username })
      );
      router.push("/");
    } else {
      toast.error("username already taken! try another one :)");
    }
  };

  //   useEffect(() => {
  //     const user = localStorage.getItem("user");
  //     if (user) {
  //       const parsedUser = JSON.parse(user);
  //       if (parsedUser.id && parsedUser.username) {
  //         router.push("/");
  //       }
  //     }
  //   }, [router]);

  return (
    <>
      <Head>
        <title>spella - sign up</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <div className="flex flex-col mx-auto h-dvh w-dvw py-4 px-2 max-w-xl">
        <Header />
        <div className="flex flex-1 items-center justify-center mx-auto">
          <div className="w-full">
            <form
              onSubmit={handleSignup}
              className="rounded-xl px-8 pt-6 pb-8 mb-4 space-y-16"
            >
              <label
                className="flex justify-center text-gray-500 text-xl md:text-3xl font-semibold tracking-wide"
                htmlFor="username"
              >
                choose a unique username
              </label>
              <input
                className="shadow appearance-none rounded-lg w-full py-3 px-3 leading-tight outline-none"
                id="username"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={30}
                minLength={3}
                required
              />
              <div className="flex items-center justify-center">
                <button
                  className="outline-none shadow-lg flex items-center text-white text-xl px-8 py-2 rounded-xl bg-gradient-to-bl from-yellow-400 to-amber-500"
                  type="submit"
                >
                  let&rsquo;s go <FaArrowRightLong className="ml-2" />
                </button>
              </div>
            </form>
          </div>
        </div>
        <Toaster position="top-center" visibleToasts={1} />
      </div>
    </>
  );
}
