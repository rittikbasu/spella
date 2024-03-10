import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";

import { GiBee } from "react-icons/gi";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { BsSpellcheck } from "react-icons/bs";
import { PiFlagCheckeredDuotone } from "react-icons/pi";
import { TbTargetArrow } from "react-icons/tb";
import { LuHeartHandshake } from "react-icons/lu";
import { IoClose } from "react-icons/io5";

const Header = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <>
      <div className="w-full max-w-xl mb-4 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <GradientIcon
            IconComponent={GiBee}
            svgClassName="w-7 h-7 relative md:bottom-[1.1rem] bottom-[0.9rem]"
            viewBox={"0 0 16 16"}
          />
          <Link
            href="/"
            className="md:text-5xl text-4xl font-josefin font-bold ml-[-1rem]"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-amber-200 to-amber-500">
              spel
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-gray-500/80 to-black">
              lol
            </span>
          </Link>
        </div>
        <button
          className="flex items-center gap-2 py-1 pl-4 pr-1 md:px-4 md:bg-gradient-to-t bg-gradient-to-r md:border border-y border-l border-black/5 from-lime-100/50 via-lime-100/80 to-lime-50/50 md:rounded-xl rounded-l-xl outline-none"
          onClick={() => setModalOpen(true)}
        >
          <MdOutlineRestaurantMenu className="w-5 h-5 md:h-6 md:w-6" />
          <span className="md:text-2xl text-lg font-semibold tracking-wider mr-1">
            menu
          </span>
        </button>
      </div>
      {isModalOpen && <MenuModal setModalOpen={setModalOpen} />}
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

const MenuModal = ({ setModalOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const isCurrentPage = (href) => router.pathname === href;

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setModalOpen(false);
    }, 200);
  };

  useEffect(() => {
    setIsOpen(true);
  }, []);
  return (
    <div
      className={clsx(
        "fixed inset-0 z-10 bg-black bg-opacity-30 flex justify-center items-center transition-opacity duration-300",
        isOpen
          ? "opacity-100 backdrop-blur-2xl"
          : "opacity-0 backdrop-blur-sm pointer-events-none"
      )}
    >
      <div
        className={clsx(
          "relative bg-white bg-opacity-30 py-12 md:py-14 rounded-3xl w-4/5 max-w-sm flex justify-center transition-all duration-500 transform",
          isOpen ? "scale-100" : "scale-50"
        )}
      >
        <ul className="space-y-8 text-2xl md:text-3xl text-gray-800 tracking-wide">
          <Link
            href="/daily"
            className={clsx(
              "flex items-center gap-6 cursor-pointer",
              isCurrentPage("/daily") ? "text-lime-200" : "hover:text-lime-200"
            )}
          >
            <BsSpellcheck />
            daily
          </Link>
          <Link
            href="/practice"
            className={clsx(
              "flex items-center gap-6 cursor-pointer",
              isCurrentPage("/practice")
                ? "text-lime-200"
                : "hover:text-lime-200"
            )}
          >
            <TbTargetArrow />
            practice
          </Link>
          <Link
            href="/leaderboard"
            className={clsx(
              "flex items-center gap-6 cursor-pointer",
              isCurrentPage("/leaderboard")
                ? "text-lime-200"
                : "hover:text-lime-200"
            )}
          >
            <PiFlagCheckeredDuotone />
            leaderboard
          </Link>
          <Link
            href="/credits"
            className={clsx(
              "flex items-center gap-6 cursor-pointer",
              isCurrentPage("/credits")
                ? "text-lime-200"
                : "hover:text-lime-200"
            )}
          >
            <LuHeartHandshake />
            credits
          </Link>
        </ul>
        <div className="absolute top-0 right-0 rounded-tr-3xl rounded-bl-3xl p-2 px-4 bg-black flex">
          <button
            type="button"
            className="text-gray-300 flex items-center md:text-lg group hover:text-red-500"
            onClick={() => handleClose()}
          >
            <IoClose className="h-5 w-5 md:h-6 md:w-6 fill-gray-300 mr-2 group-hover:fill-red-500" />
            close
          </button>
        </div>
      </div>
    </div>
  );
};
