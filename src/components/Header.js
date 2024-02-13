import { useState } from "react";
import { GiBee } from "react-icons/gi";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { BsSpellcheck } from "react-icons/bs";
import { FaFlagCheckered } from "react-icons/fa6";
import { TbTargetArrow } from "react-icons/tb";

const Header = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!isModalOpen);
  return (
    <>
      <div className="w-full max-w-xl mb-4 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <GradientIcon
            IconComponent={GiBee}
            svgClassName="w-7 h-7 relative md:bottom-[1.1rem] bottom-[0.9rem] animate-wiggle"
            viewBox={"0 0 16 16"}
          />
          <div className="md:text-5xl text-4xl font-josefin font-bold ml-[-1rem]">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-amber-200 to-amber-500">
              spel
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-gray-500/80 to-black">
              lol
            </span>
          </div>
        </div>
        <button
          className="flex items-center gap-2 py-1 pl-4 pr-1 md:px-4 md:bg-gradient-to-t hover:shadow-lg hover:shadow-lime-200/70 bg-gradient-to-r md:border border-y border-l border-black/5 from-lime-100/50 via-lime-100/80 to-lime-50/50 md:rounded-xl rounded-l-xl outline-none"
          onClick={toggleModal}
        >
          <MdOutlineRestaurantMenu className="w-5 h-5 md:h-6 md:w-6" />
          <span className="md:text-2xl text-lg font-semibold tracking-wider mr-1">
            menu
          </span>
        </button>
      </div>
      {isModalOpen && <MenuModal onClose={toggleModal} />}
    </>
  );
};

export default Header;

const GradientIcon = ({
  IconComponent,
  gradientId = "icon-gradient",
  svgClassName,
  viewBox,
}) => {
  return (
    <svg className={svgClassName} viewBox={viewBox}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" /> {/* Amber color */}
          <stop offset="100%" stopColor="#111827" /> {/* Black color */}
        </linearGradient>
      </defs>
      <IconComponent fill={`url(#${gradientId})`} />
    </svg>
  );
};

const MenuModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-10 bg-black/30 backdrop-blur-lg flex justify-center items-center">
      <div className=" bg-gradient-to-t from-lime-200/40 via-lime-200/30 to-lime-200/10 p-5 md:p-6 rounded-2xl w-4/5 max-w-72 flex justify-center">
        <ul className="space-y-8 text-2xl md:text-3xl text-gray-800 tracking-wide font-light">
          <li className="flex items-center gap-6 cursor-pointer hover:text-amber-600">
            <BsSpellcheck className="" />
            daily
          </li>
          <li className="flex items-center gap-6 cursor-pointer hover:text-amber-600">
            <TbTargetArrow className="" />
            practice
          </li>
          <li className="flex items-center gap-6 cursor-pointer hover:text-amber-600">
            <FaFlagCheckered className="w-[1.4rem] h-[1.4rem] md:w-7 md:h-7" />
            leaderboard
          </li>
          <button
            onClick={onClose}
            className="text-red-500 flex items-center gap-6 cursor-pointer hover:text-red-700"
          >
            <ImCross className="w-[1.1rem] h-[1.1rem] md:w-6 md:h-6" />
            close
          </button>
        </ul>
      </div>
    </div>
  );
};
