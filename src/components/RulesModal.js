import { FaPlayCircle } from "react-icons/fa";
import { FaKeyboard } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { MdTypeSpecimen } from "react-icons/md";
import { FaDice } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";

const RulesModal = ({ showRulesModal, setShowRulesModal }) => {
  return (
    showRulesModal && (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-xl flex justify-center items-center z-20">
        <div className="bg-white/30 py-8 px-4 md:px-4 rounded-3xl max-w-md w-full mx-8 flex flex-col justify-center gap-y-8">
          <div className="text-2xl font-bold text-center">how to play?</div>
          <div className="flex justify-center md:text-lg text-pretty">
            <table>
              <tbody>
                <tr>
                  <td className="py-2 align-middle text-center px-2">
                    <FaPlayCircle className="w-7 h-7 mx-auto" />
                  </td>
                  <td className="py-2 align-middle px-2">
                    play the audio to hear the word & its description
                  </td>
                </tr>
                <tr>
                  <td className="py-2 align-middle text-center px-2">
                    <FaKeyboard className="w-7 h-7 mx-auto" />
                  </td>
                  <td className="py-2 align-middle px-2">
                    use the on-screen keyboard to type
                  </td>
                </tr>
                <tr>
                  <td className="py-2 align-middle text-center px-2">
                    <MdTypeSpecimen className="w-7 h-7 mx-auto" />
                  </td>
                  <td className="py-2 align-middle px-2">
                    there are 10 words in total
                  </td>
                </tr>
                <tr>
                  <td className="py-2 align-middle text-center px-2">
                    <FaDice className="w-9 h-9 mx-auto" />
                  </td>
                  <td className="py-2 align-middle px-2">
                    easy: 2, medium: 3, difficult: 5
                  </td>
                </tr>
                <tr>
                  <td className="py-2 align-middle text-center px-2">
                    <FaCheck className="w-7 h-7 mx-auto" />
                  </td>
                  <td className="py-2 align-middle px-2">
                    press submit after typing each word
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-center">
            <button
              className="outline-none shadow-lg flex items-center text-white text-xl px-8 py-2 rounded-xl bg-gradient-to-bl from-yellow-400 to-amber-500 active:scale-95 transition-all duration-300"
              onClick={() => setShowRulesModal(false)}
            >
              let&rsquo;s go <BsArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default RulesModal;
