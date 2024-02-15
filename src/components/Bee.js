const Bee = () => {
  return (
    <div className="relative flex flex-col items-center justify-center border-amber-200 md:bg-gradient-to-bl from-lime-50 to-lime-200 rounded-full mt-16 max-w-[30rem] min-w-[20rem] min-h-[20rem] mx-auto">
      <div className="bee">
        <div className="bee-body">
          <div className="blink"></div>
          <div className="mouth"></div>
          <div className="antenae"></div>
          <div className="bee-left"></div>
          <div className="bee-right"></div>
        </div>
      </div>
      <svg
        className="absolute md:hidden top-0 left-0 w-full h-full animate-spin-slow"
        viewBox="0 0 100 100"
      >
        <path
          id="circle-path"
          fill="transparent"
          d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0 "
        />
        <text>
          <textPath
            href="#circle-path"
            startOffset="0%"
            style={{
              fontSize: "0.76em",
              fill: "black",
            }}
          >
            gotta spell em all • gotta spell em all •
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default Bee;
