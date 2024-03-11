import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { v4 as uuidv4 } from "uuid";
import clsx from "clsx";
import { toast, Toaster } from "sonner";

import { IoMdCloseCircle } from "react-icons/io";
import { FaPlay, FaCheck, FaPause } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";

import { supabase } from "@/utils/supabaseClient";
import Header from "@/components/Header";
import RulesModal from "@/components/RulesModal";
import Results from "@/components/Results";

function Home({ words }) {
  console.log("Words", words);
  let keyboard;
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [word, setWord] = useState(words[currentWordIndex]?.word);
  const [input, setInput] = useState("");
  const [inputLog, setInputLog] = useState([]);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showRulesModal, setShowRulesModal] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [showResults, setShowResults] = useState(false);

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

  async function updateLocalStorageInputs(input, correct, time) {
    const existingInputs =
      JSON.parse(localStorage.getItem("daily_inputs")) || [];

    existingInputs.push({
      input,
      correct,
      added_at: time,
    });

    localStorage.setItem("daily_inputs", JSON.stringify(existingInputs));
  }

  const handleSubmit = async () => {
    if (input === "") return;
    console.log("input", inputLog);
    // Stop the current audio if it exists
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
    const time = new Date().toISOString();
    const updatedInputLog = [
      ...inputLog,
      { user: input, correct: word, added_at: time },
    ];

    if (input.toLowerCase() === word.toLowerCase()) {
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
    updateLocalStorageInputs(input, word, time);

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
      let user_id = localStorage.getItem("user_id");
      console.log("user_id", user_id);
      if (!user_id) {
        user_id = uuidv4();
        localStorage.setItem("user_id", user_id);
      }
      const response = await fetch("/api/updateDailyInputs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          inputLog: updatedInputLog,
        }),
      });

      if (!response.ok) {
        toast.error("error updating results to database");
      }
    }
    setInputLog(updatedInputLog);
    setTimeout(() => setFeedback(null), 2000);
  };

  const setupAudio = async (wordIndex) => {
    const audioUrl = words[wordIndex]?.openai_audio;
    if (audioUrl) {
      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;

      newAudio.onended = () => setIsPlaying(false);
    }
  };

  async function fetchAttemptedWords() {
    const today = new Date().toISOString().split("T")[0];
    const dailyDate = localStorage.getItem("daily_date");

    if (dailyDate === today) {
      let index = 0;
      try {
        const attemptedWords =
          JSON.parse(localStorage.getItem("daily_inputs")) || [];
        setShowResults(attemptedWords.length === words.length);
        setShowRulesModal(attemptedWords.length === 0);

        setInputLog(
          attemptedWords.map(({ input, correct, added_at }) => ({
            user: input,
            correct,
            added_at,
          }))
        );

        index =
          attemptedWords.length < words.length ? attemptedWords.length : 0;
        setCurrentWordIndex(index);
        setWord(words[index]?.word);
      } catch (error) {
        console.error("error fetching attempted words from local storage:");
        localStorage.removeItem("daily_inputs");
      } finally {
        await setupAudio(index);
        setDisableSubmit(false);
      }
    } else {
      // If daily_date is not today, set it to today and clear previous attempts
      localStorage.setItem("daily_date", today);
      localStorage.removeItem("daily_inputs");
    }
  }

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
    fetchAttemptedWords();
  }, []);
  return (
    <>
      <Head>
        <title>spellol - daily challenge</title>
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
        {words.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full mx-2">
            <p className="text-2xl text-pretty text-gray-700 rounded-xl bg-gray-200 p-6">
              generating the daily challenge, please reload the page.
            </p>
          </div>
        ) : (
          <>
            {showResults ? (
              <Results inputLog={inputLog} />
            ) : (
              <>
                <RulesModal
                  showRulesModal={showRulesModal}
                  setShowRulesModal={setShowRulesModal}
                />
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
                  <div className="text-sm text-gray-400 tracking-wider bg-gray-100/30">
                    {currentWordIndex + 1} of {words.length}
                  </div>
                  <div className="text-center px-2 mt-4 break-all backdrop-blur-sm">
                    {input === "" ? (
                      <span className="text-2xl md:text-4xl tracking-wider text-zinc-400">
                        let&rsquo;s get typing
                        <span className="border-l-2 border-transparent animate-caret"></span>
                      </span>
                    ) : (
                      <span className="text-2xl md:text-4xl tracking-widest">
                        {input}
                        <span className="border-l-2 border-transparent animate-caret"></span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-full px-1 flex flex-col">
                  <div className="rounded-xl overflow-hidden py-2 md:px-2 h-[156px] old-keyboard-style">
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
                    disabled={disableSubmit}
                    className={clsx(
                      "order-last md:order-first items-center transition hover:shadow-2xl active:scale-95 duration-300 mx-auto outline-none shadow-lg text-white text-xl px-8 md:my-8 rounded-xl mt-4",
                      feedback === "correct"
                        ? "bg-gradient-to-bl shadow-lime-200 from-lime-400 to-lime-500"
                        : feedback === "incorrect"
                        ? "border-red-300 shadow-red-100 border bg-gradient-to-bl from-gray-100 via-gray-200 to-gray-300"
                        : "bg-gradient-to-bl from-yellow-400 to-amber-500"
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
                        submit <BsArrowRight className="ml-2" />
                      </div>
                    )}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
      <Toaster
        position="top-center"
        visibleToasts={1}
        // richColors={true}
      />
    </>
  );
}

export async function getServerSideProps() {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("spellol_daily")
    .select("id, word, openai_audio")
    .eq("created_at", today);

  if (error) {
    console.error("Error fetching words from Supabase", error);
    return { props: { words: [] } };
  }

  return {
    props: {
      words: data,
    },
  };
}

export default Home;
