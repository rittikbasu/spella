import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";
import { BsArrowRight } from "react-icons/bs";
import Bee from "@/components/Bee";

export default function Home() {
  return (
    <>
      <Head>
        <title>spellol - gotta spell em&rsquo; all!</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <div className="max-w-xl md:py-8 px-2 pt-4 h-dvh w-dvw flex flex-col mx-auto">
        <Header />
        <main className="flex flex-col items-center justify-center text-center h-full px-4 gap-y-4 md:pb-8 pb-4 overflow-x-clip">
          <Bee />
          <div className="flex flex-col gap-y-2 md:gap-y-4 md:mt-8 items-center">
            <p className="text-2xl bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-500">
              remember spelling bees?
            </p>
            <p className="text-2xl bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-500">
              it&rsquo;s back & to win you
            </p>
            <span className="font-bold text-4xl md:text-5xl md:leading-normal bg-clip-text text-transparent bg-gradient-to-b from-amber-200 to-amber-500 mt-1 md:mt-4">
              gotta spell em&rsquo; all
            </span>
          </div>
          <Link
            href="/daily"
            className="bg-gradient-to-bl from-yellow-400 to-amber-500 shadow-lg text-white font-bold py-2 rounded-xl text-2xl mt-2 md:mt-8 px-8 hover:shadow-2xl active:scale-95 transition-all duration-300 outline-none"
          >
            <div className="flex items-center justify-center">
              play now
              <BsArrowRight className="ml-2" />
            </div>
          </Link>
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
    </>
  );
}
