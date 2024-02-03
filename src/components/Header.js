import React from "react";

const Header = () => {
  return (
    <div className="w-full max-w-xl mx-auto mb-4 pl-2 md:px-2 flex justify-between items-center">
      <span className="md:text-4xl text-3xl text-left font-bold bg-clip-text text-transparent bg-gradient-to-b from-amber-200 to-amber-500">
        spella
      </span>
      <span className="md:text-2xl text-xl font-mono bg-gradient-to-r from-lime-100 via-lime-100 to-lime-50/20 rounded-l-xl text-black py-1 px-4">
        daily challenge
      </span>
    </div>
  );
};

export default Header;
