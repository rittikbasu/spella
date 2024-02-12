import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { createClient } from "@supabase/supabase-js";
import clsx from "clsx";
import { toast, Toaster } from "sonner";

import { IoMdCloseCircle } from "react-icons/io";
import { ImCross } from "react-icons/im";
import { FaPlay, FaCheck, FaPause, FaBug } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";

import Header from "@/components/Header";

function Home({ words }) {
  // console.log("Words", words);
  let keyboard;
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [word, setWord] = useState(words[currentWordIndex].word);
  const [input, setInput] = useState("");
  const [inputLog, setInputLog] = useState([]);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isTruncated, setIsTruncated] = useState(true);
  const [isReportMode, setIsReportMode] = useState(false);
  const [reportedWords, setReportedWords] = useState([]);

  const keyboardOnChange = (input) => {
    setInput(input);
  };

  const onKeyPress = (button) => {
    console.log("Button pressed", button);
    if (button === "{bksp}") {
      setInput((prev) => prev.slice(0, -1));
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSubmit = () => {
    if (input === "") return;

    // Stop the current audio if it exists
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }

    setInputLog((prevLog) => [...prevLog, { user: input, correct: word }]);

    if (input.toLowerCase() === word.toLowerCase()) {
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
    const nextWordIndex = currentWordIndex + 1;

    if (nextWordIndex < words.length) {
      setCurrentWordIndex(nextWordIndex);
      setWord(words[nextWordIndex].word);
      setInput("");

      const newAudio = new Audio(words[nextWordIndex].openai_audio);
      audioRef.current = newAudio;

      newAudio.onended = () => {
        setIsPlaying(false);
      };

      setTimeout(() => {
        newAudio
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Error playing the audio", error);
          });
      }, 500);
    } else {
      setShowResults(true);
    }
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    if (checked) {
      setReportedWords((prev) => [...prev, value]);
    } else {
      setReportedWords((prev) => prev.filter((word) => word !== value));
    }
  };

  useEffect(() => {
    if (words.length > 0) {
      const initialAudio = new Audio(words[0].openai_audio);
      audioRef.current = initialAudio;

      initialAudio.onended = () => {
        setIsPlaying(false);
      };
    }
  }, [words]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      let key = e.key;
      if (key === "Enter") {
        e.preventDefault();
        handleSubmit();
      } else if (key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(key)) {
        setInput((prev) => {
          if (prev.length >= 21) return prev;
          return prev + key.toLowerCase();
        });
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [input, word]);

  useEffect(() => {
    // Only attempt to submit when not in report mode and there are words to report
    if (!isReportMode && reportedWords.length > 0) {
      const submitReport = async () => {
        console.log("Submitting");
        try {
          const response = await fetch("/api/incrementReports", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ words: reportedWords }),
          });

          if (response.ok) {
            console.log("reported successfully");
            toast.success("reported successfully");
            setReportedWords([]);
          } else {
            console.error("error reporting bug", response.statusText);
            toast.error("error reporting bug");
          }
        } catch (error) {
          console.error("error reporting bug", error);
          toast.error("error reporting bug");
        }
      };

      submitReport();
    }
  }, [reportedWords, isReportMode]);

  const getColorClass = (index) => {
    if (index < 2)
      return "bg-gradient-to-r from-lime-50/50 via-lime-100 rounded pl-2";
    if (index < 5)
      return "bg-gradient-to-r from-amber-50/50 via-amber-100 rounded pl-2";
    return "bg-gradient-to-r from-red-50/30 via-red-100 rounded pl-2";
  };
  return (
    <>
      <Head>
        <title>spella - daily challenge</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <div
        className={clsx(
          "max-w-xl md:py-8 px-2 py-4 h-dvh w-dvw flex flex-col mx-auto",
          showResults ? "justify-start overflow-y-auto" : "justify-between"
        )}
      >
        <Header />

        {showResults ? (
          <div className="flex flex-col items-center md:justify-center md:h-full gap-y-8 md:gap-y-16 mt-8 md:mt-16">
            <h2 className="text-2xl font-bold md:mt-0 md:text-4xl">
              your results
            </h2>
            <div className="flex justify-center items-center space-x-4 bg-gray-100 shadow-lg border p-2 rounded-xl">
              <span className="flex items-center">
                <span className="h-4 w-4 rounded-full bg-lime-400 inline-block mr-2"></span>
                easy
              </span>
              <span className="flex items-center">
                <span className="h-4 w-4 rounded-full bg-yellow-400 inline-block mr-2"></span>
                medium
              </span>
              <span className="flex items-center">
                <span className="h-4 w-4 rounded-full bg-red-500 inline-block mr-2"></span>
                difficult
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 w-full">
              {inputLog.map((entry, index) => (
                <div
                  key={index}
                  className="flex justify-start items-center p-2 space-x-4 break-all text-pretty"
                >
                  <span
                    className={clsx(
                      "text-lg font-medium flex-1 text-left",
                      isTruncated ? "truncate" : ""
                    )}
                    onClick={() => setIsTruncated(!isTruncated)}
                  >
                    <span className={clsx("", getColorClass(index))}>
                      {entry.correct}
                    </span>
                  </span>
                  <span
                    className={`text-lg flex-1 text-left ${
                      entry.user.toLowerCase() === entry.correct.toLowerCase()
                        ? "text-gray-800"
                        : "text-gray-800 underline decoration-wavy underline-offset-4 decoration-red-500"
                    }`}
                  >
                    {entry.user}
                  </span>
                  {isReportMode ? (
                    <input
                      type="checkbox"
                      value={entry.correct}
                      className="w-4 h-4 rounded-full outline-none"
                      onChange={handleCheckboxChange}
                    />
                  ) : entry.user.toLowerCase() ===
                    entry.correct.toLowerCase() ? (
                    <FaCheck className="text-lime-400" />
                  ) : (
                    <ImCross className="text-red-400" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center items-center">
              {isReportMode ? (
                <p className="text-justify text-sm text-gray-600">
                  select the words you faced an issue with
                </p>
              ) : (
                <p className="text-justify text-sm text-gray-600">
                  faced an issue with the audio or description?
                </p>
              )}
              <button
                className={clsx(
                  "bg-gradient-to-t w-32 shadow-lg text-white font-bold rounded-lg mt-4 flex items-center justify-center py-2",
                  // isReportMode
                  //   ? "from-lime-500 to-lime-300"
                  //   :
                  "from-red-800 to-red-500"
                )}
                onClick={() => setIsReportMode((prev) => !prev)}
              >
                <FaBug className="mr-2" />{" "}
                {isReportMode
                  ? reportedWords.length === 0
                    ? "cancel"
                    : "submit"
                  : "report bug"}
              </button>
              <Toaster
                position="top-center"
                visibleToasts={1}
                // richColors={true}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center">
              <button
                className="bg-gradient-to-bl from-amber-400 to-amber-500 group shadow-lg outline-none text-white font-bold p-8 rounded-full"
                onClick={playAudio}
              >
                {isPlaying ? (
                  <FaPause className="text-4xl text-orange-950 group-hover:text-white" />
                ) : (
                  <FaPlay className="text-4xl text-orange-950 group-hover:text-white" />
                )}
              </button>
            </div>

            <div className="flex flex-col justify-center items-center w-full">
              <div className="text-center space-y-4 p-2 bg-gray-100/30 break-all">
                {input === "" ? (
                  <span className="text-2xl md:text-4xl tracking-wider text-zinc-400">
                    let&rsquo;s get typing
                    <span className="border-l-2 border-transparent animate-blink"></span>
                  </span>
                ) : (
                  <span className="text-2xl md:text-4xl tracking-widest">
                    {input}
                  </span>
                )}
                <div className="text-sm text-gray-400 tracking-wider">
                  {currentWordIndex + 1} of {words.length}
                </div>
              </div>
            </div>

            <div className="w-full px-1 flex flex-col">
              <div className="rounded-xl overflow-hidden py-2 md:px-2 h-[156px]  old-keyboard-style">
                <Keyboard
                  key={currentWordIndex}
                  keyboardRef={(r) => (keyboard = r)}
                  onChange={(newInput) => keyboardOnChange(newInput)}
                  onKeyPress={(button) => onKeyPress(button)}
                  maxLength={21}
                  theme={"hg-theme-default hg-layout-default my-theme"}
                  layout={{
                    default: [
                      "q w e r t y u i o p",
                      "a s d f g h j k l",
                      "z x c v b n m {bksp}",
                    ],
                  }}
                  buttonTheme={[
                    {
                      class: "hg-red hg-bigger-backspace",
                      buttons: "{bksp}",
                    },
                  ]}
                  display={{
                    "{bksp}": "delete",
                  }}
                  physicalKeyboardHighlight={input.length < 21}
                  physicalKeyboardHighlightTextColor="#f59e0b"
                  physicalKeyboardHighlightBgColor="#d1d5db"
                />
              </div>
              <button
                onClick={handleSubmit}
                className={clsx(
                  "order-last md:order-first items-center transition-shadow duration-300 mx-auto outline-none shadow-lg text-white text-xl px-8 md:my-8 rounded-xl mt-4",
                  feedback === "correct"
                    ? "bg-gradient-to-bl shadow-lime-200 from-lime-400 to-lime-500"
                    : feedback === "incorrect"
                    ? "border-red-300 shadow-red-100 border bg-gradient-to-bl from-gray-100 via-gray-200 to-gray-300"
                    : "bg-gradient-to-bl from-yellow-400 to-amber-500 "
                )}
              >
                {feedback === "correct" ? (
                  <div className="flex items-center py-2">
                    correct <FaCheck className="ml-2" />
                  </div>
                ) : feedback === "incorrect" ? (
                  <div className="flex items-center text-gray-600 py-[0.44rem]">
                    <IoMdCloseCircle className="mr-2 h-6 w-6 text-red-400" />
                    oooops
                  </div>
                ) : (
                  <div className="flex items-center py-2">
                    submit <FaArrowRightLong className="ml-2" />
                  </div>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export async function getStaticProps() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;
  const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
  const { data, error } = await supabase
    .from("spellol_daily")
    .select("id, word, openai_audio");

  if (error) {
    console.error("Error fetching words from Supabase", error);
    return { props: { words: [] } };
  }

  return {
    props: {
      words: data,
    },
    revalidate: 1,
  };
}

export default Home;
