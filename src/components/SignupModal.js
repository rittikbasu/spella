import { useState } from "react";
import { useRouter } from "next/router";
import { toast, Toaster } from "sonner";
import { IoClose } from "react-icons/io5";
import { BsArrowRight } from "react-icons/bs";

const SignupModal = ({ showSignup, setShowSignup }) => {
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
      router.push("/daily");
    } else if (response.status === 400) {
      toast.error("pls choose a username without profanity");
    } else if (response.status === 409) {
      toast.error("username already taken! try another one :)");
    } else {
      toast.error("Internal Server Error");
    }
  };

  const sanitizeUsername = (input) => {
    return input.toLowerCase().replace(/[^a-z0-9]/g, "");
  };

  return (
    showSignup && (
      <div className="fixed inset-0 backdrop-blur-xl flex justify-center items-center z-20">
        <form
          onSubmit={handleSignup}
          className="relative rounded-3xl mx-4 py-8 space-y-8 bg-white/30 border border-gray-200 flex flex-col w-full max-w-lg px-4 md:px-8"
        >
          <label
            className="text-pretty text-gray-800 text-2xl md:text-2xl ml-1 font-semibold tracking-wide"
            htmlFor="username"
          >
            but first, <br />
            let&rsquo;s choose a unique username
          </label>
          <input
            className="appearance-none border border-gray-200 rounded-xl w-full py-3 px-3 leading-tight outline-none"
            id="username"
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(sanitizeUsername(e.target.value))}
            maxLength={20}
            minLength={3}
            required
            pattern="^(?=.*[a-z])[a-z0-9]*$"
            title="use letters or combination of letters + numbers"
          />
          <div className="flex items-center justify-center">
            <button
              className="outline-none shadow-lg flex items-center text-white text-xl px-8 py-2 rounded-xl bg-gradient-to-bl from-yellow-400 to-amber-500 active:scale-95 transition-all duration-300"
              type="submit"
            >
              let&rsquo;s go <BsArrowRight className="ml-2" />
            </button>
          </div>
          <div className="absolute -top-[2.05rem] -right-[0.05rem] rounded-tr-3xl rounded-bl-3xl p-2 px-4 bg-black flex">
            <button
              type="button"
              className="text-gray-300 flex items-center"
              onClick={() => setShowSignup(false)}
            >
              <IoClose className="h-5 w-5 fill-gray-300 mr-2" />
              close
            </button>
          </div>
        </form>
        <Toaster position="top-center" visibleToasts={1} />
      </div>
    )
  );
};

export default SignupModal;
