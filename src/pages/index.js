import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";
import { useRouter } from "next/router";
import { BsArrowRight } from "react-icons/bs";
import Bee from "@/components/Bee";
import SignupModal from "@/components/SignupModal";

export default function Home() {
  const router = useRouter();
  const [showSignup, setShowSignup] = useState(false);

  const handlePlayNow = () => {
    const storedUser = localStorage.getItem("user");
    const id = storedUser ? JSON.parse(storedUser)?.id : null;

    if (id) {
      fetch(`/api/userExists?userId=${id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.userExists) {
            router.push("/daily");
          } else {
            setShowSignup(true);
          }
        });
    } else {
      setShowSignup(true);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const id = storedUser ? JSON.parse(storedUser)?.id : null;
    if (router.query.signup === "true" && !id) {
      setShowSignup(true);
    }
  }, [router.query]);

  return (
    <>
      <Head>
        <title>spellol - gotta spell em&rsquo; all!</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <div className="max-w-xl md:py-8 px-2 pt-4 h-dvh w-dvw flex flex-col mx-auto overflow-x-hidden">
        <Header />
        <main className="flex flex-col items-center justify-center text-center h-full px-4 gap-y-4 md:pb-8 pb-4">
          <Bee />
          <div className="flex flex-col gap-y-2 md:gap-y-4 md:mt-16 items-center">
            <p className="text-2xl bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-500">
              remember spelling bees?
            </p>
            <p className="text-2xl bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-500">
              it&rsquo;s back & to win you
            </p>
            <span className="font-bold text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-amber-200 to-amber-500 mt-1 md:mt-4">
              gotta spell em&rsquo; all
            </span>
          </div>
          <button
            className="bg-gradient-to-bl from-yellow-400 to-amber-500 shadow-lg text-white font-bold py-2 rounded-xl text-2xl mt-2 md:mt-12 px-8 hover:shadow-2xl active:scale-95 transition-all duration-300 outline-none"
            onClick={handlePlayNow}
          >
            <div className="flex items-center justify-center">
              play now
              <BsArrowRight className="ml-2" />
            </div>
          </button>
        </main>
        <footer className="flex items-center justify-center text-gray-600 text-sm md:text-lg py-4">
          <Link
            href="https://rittik.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:underline-offset-2 hover:text-amber-500"
          >
            made by _rittik
          </Link>
        </footer>
      </div>
      <SignupModal showSignup={showSignup} setShowSignup={setShowSignup} />
    </>
  );
}
