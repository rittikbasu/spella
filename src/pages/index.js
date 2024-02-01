import { useState, useEffect } from "react";
import Head from "next/head";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { FaPlay } from "react-icons/fa";
import { FaArrowRightLong, FaPause } from "react-icons/fa6";

import Header from "@/components/Header";

function Home() {
  let keyboard;
  const [input, setInput] = useState("");
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const onChange = (newInput) => {
    setInput(newInput);
  };

  const onKeyPress = (button) => {
    console.log("Button pressed", button);
  };

  const handleKeyPress = (e) => {
    let key = e.key;
    if (key === "Backspace") {
      setInput((prev) => prev.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(key)) {
      setInput((prev) => {
        if (prev.length >= 45) return prev;
        return prev + key.toLowerCase();
      });
    }
  };

  const playAudio = () => {
    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    const audioInstance = new Audio("/audio/musician_audio.ogg");
    setAudio(audioInstance);

    const handleAudioEnd = () => setIsPlaying(false);
    audioInstance.addEventListener("ended", handleAudioEnd);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      audioInstance.removeEventListener("ended", handleAudioEnd);
    };
  }, []);

  return (
    <>
      <Head>
        <title>spella - daily challenge</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <div className="max-w-lg md:py-8 px-2 py-4 h-dvh w-dvw flex flex-col justify-between mx-auto">
        <Header />

        <div className="flex items-center justify-center">
          <button
            className="bg-gradient-to-bl from-yellow-400 to-amber-500 group outline-none text-white font-bold p-8 rounded-full"
            onClick={playAudio}
          >
            {isPlaying ? (
              <FaPause className="text-4xl text-black/70 group-hover:text-white" />
            ) : (
              <FaPlay className="text-4xl text-black/70 group-hover:text-white" />
            )}
          </button>
        </div>

        <div className="flex flex-col justify-center items-center w-full">
          <div className="border-2 border-amber-400 min-w-72 text-center rounded-xl mb-4 p-2 bg-white break-all">
            {input === "" ? (
              <span className="text-2xl tracking-wider text-zinc-400">
                let&rsquo;s get typing
              </span>
            ) : (
              <span className="text-2xl tracking-widest">{input}</span>
            )}
          </div>
        </div>

        <div className="w-full md:max-w-lg px-1">
          <button
            // onClick={handleSubmit}
            className="md:flex items-center hidden mx-auto shadow-lg bg-gradient-to-bl from-yellow-400 to-amber-500 text-white px-8 py-2 my-8 rounded-xl mt-4"
          >
            Submit <FaArrowRightLong className="ml-2" />
          </button>
          <div className="rounded-xl overflow-hidden py-2 md:px-2 old-keyboard-style">
            <Keyboard
              keyboardRef={(r) => (keyboard = r)}
              onChange={(newInput) => onChange(newInput)}
              onKeyPress={(button) => onKeyPress(button)}
              maxLength={45}
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
                  class: "hg-red",
                  buttons: "{bksp}",
                },
              ]}
            />
          </div>
          <button
            // onClick={handleSubmit}
            className="mx-auto md:hidden bg-gradient-to-bl shadow-lg from-yellow-400 to-amber-500 text-white px-8 py-2 rounded-xl mt-4 flex items-center"
          >
            Submit
            <FaArrowRightLong className="ml-2" />
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
