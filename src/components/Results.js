import { useState, useEffect } from "react";
import Link from "next/link";
import { FaCheck, FaBug } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { BsArrowRight } from "react-icons/bs";
import clsx from "clsx";

const Results = ({ inputLog }) => {
  const [isReportMode, setIsReportMode] = useState(false);
  const [reportedWords, setReportedWords] = useState([]);
  const [isTruncated, setIsTruncated] = useState(true);

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    if (checked) {
      setReportedWords((prev) => [...prev, value]);
    } else {
      setReportedWords((prev) => prev.filter((word) => word !== value));
    }
  };
  const getColorClass = (index) => {
    if (index < 2)
      return "bg-gradient-to-r from-lime-50/50 via-lime-100 rounded pl-2";
    if (index < 5)
      return "bg-gradient-to-r from-amber-50/50 via-amber-100 rounded pl-2";
    return "bg-gradient-to-r from-red-50/30 via-red-100 rounded pl-2";
  };

  useEffect(() => {
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
            toast.success("reported successfully");
            setReportedWords([]);
          } else {
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
  return (
    <div className="flex flex-col items-center md:justify-center md:h-full gap-y-8 md:gap-y-16 mt-8 md:mt-16">
      <h2 className="text-2xl font-bold md:mt-0 md:text-4xl">your results</h2>
      <div className="flex justify-center items-center space-x-8 bg-gray-50 border py-2 px-4 rounded-xl">
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
                entry.user?.toLowerCase() === entry.correct.toLowerCase()
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
            ) : entry.user?.toLowerCase() === entry.correct.toLowerCase() ? (
              <FaCheck className="text-lime-400" />
            ) : (
              <ImCross className="text-red-400" />
            )}
          </div>
        ))}
      </div>
      <Link
        href="/leaderboard"
        className="bg-gradient-to-bl from-yellow-400 to-amber-500 transition hover:shadow-2xl active:scale-95 duration-300 text-white font-bold text-xl py-2 px-4 rounded-xl"
      >
        <div className="flex items-center justify-center">
          see leaderboard
          <BsArrowRight className="ml-2" />
        </div>
      </Link>

      <div className="flex flex-col justify-center items-center bg-gray-100 w-[96%] max-w-96 rounded-xl py-4 px-2">
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
          className="bg-gradient-to-t w-36 text-white font-bold rounded-xl mt-4 flex items-center justify-center transition active:scale-95 duration-300 py-2 from-red-600 to-red-400"
          onClick={() => setIsReportMode((prev) => !prev)}
        >
          <FaBug className="mr-2" />{" "}
          {isReportMode
            ? reportedWords.length === 0
              ? "cancel"
              : "submit"
            : "report bug"}
        </button>
      </div>
    </div>
  );
};

export default Results;
