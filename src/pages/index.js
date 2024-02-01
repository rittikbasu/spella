import { useState, useEffect } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { FaPlay } from "react-icons/fa";

function Home() {
  let keyboard;
  const [input, setInput] = useState("");
  const onChange = (newInput) => {
    setInput(newInput);
  };

  const onKeyPress = (button) => {
    console.log("Button pressed", button);
  };

  const logKey = (e) => {
    let key = e.key;
    if (key === "Backspace") {
      setInput((prev) => prev.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(key)) {
      setInput((prev) => {
        if (prev.length >= 50) return prev;
        return prev + key.toLowerCase();
      });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", logKey);

    return () => {
      window.removeEventListener("keydown", logKey);
    };
  }, []);

  return (
    <div className="max-w-lg mx-auto md:py-8 px-2 py-4 h-screen flex flex-col justify-between">
      <div className="w-full max-w-lg mx-auto mb-4 pl-2 md:px-2 flex justify-between items-center">
        <span className="text-3xl text-left font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-b from-amber-200 to-amber-500">
          spella
        </span>
        <span className="text-lg bg-blue-100 rounded-xl font-mono text-black py-1 px-4">
          daily challenge
        </span>
      </div>

      <div className="flex items-center justify-center">
        <button
          className=" bg-white outline group outline-gray-600 hover:bg-blue-500 text-white font-bold p-8 rounded-full"
          // onClick={handleButtonClick}
        >
          <FaPlay className="text-4xl text-black group-hover:text-white" />
        </button>
      </div>

      <div className="flex flex-col justify-center items-center w-full">
        <div className="border-2 border-yellow-300 min-w-72 text-center rounded-xl mb-4 p-2 bg-white break-all">
          {input === "" ? (
            <span className="text-2xl tracking-wider text-zinc-400">
              let&rsquo;s get typing
            </span>
          ) : (
            <span className="text-2xl">{input}</span>
          )}
        </div>
      </div>

      <div className="w-full md:max-w-lg px-1">
        <button
          // onClick={handleSubmit}
          className="md:block hidden mx-auto bg-amber-400 text-white px-8 py-2 my-8 rounded-xl mt-4"
        >
          Submit →
        </button>
        <div className="rounded-xl overflow-hidden py-2 md:px-2 old-keyboard-style">
          <Keyboard
            keyboardRef={(r) => (keyboard = r)}
            onChange={(newInput) => onChange(newInput)}
            onKeyPress={(button) => onKeyPress(button)}
            maxLength={50}
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
                class: "text-red-500 hg-red",
                buttons: "{bksp}",
              },
              {
                class: "text-amber-500",
                buttons: "s p e l l a",
              },
            ]}
          />
        </div>
        <button
          // onClick={handleSubmit}
          className="mx-auto md:hidden block bg-amber-400 text-white px-8 py-2 rounded-xl mt-4"
        >
          Submit →
        </button>
      </div>
    </div>
  );
}

export default Home;
