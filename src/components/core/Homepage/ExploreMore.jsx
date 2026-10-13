import { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import HighlightText from "./HighlightText";
import CourseCard from "./CourseCard";

const tabsName = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((course) => course.tag === value);
    if (result.length > 0) {
      setCourses(result[0].courses);
      setCurrentCard(result[0].courses[0].heading);
    }
  };

  return (
    <div className="flex flex-col items-center w-full relative">
      {/* Title */}
      <div className="text-3xl sm:text-4xl font-semibold text-center text-richblack-5">
        Unlock the
        <HighlightText text={"Power of Code"} />
      </div>

      <p className="text-center text-richblack-300 text-[16px] mt-3">
        Learn to Build Anything You Can Imagine
      </p>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center items-center gap-2 bg-richblack-800 rounded-full mb-10 border border-richblack-700 p-1.5 mt-7 shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
        {tabsName.map((tab, index) => {
          return (
            <button
              type="button"
              className={`text-[13px] sm:text-[15px] font-medium rounded-full transition-all duration-200 cursor-pointer px-5 sm:px-7 py-2.5 ${
                currentTab === tab
                  ? "bg-richblack-900 text-richblack-5 font-semibold shadow-inner"
                  : "text-richblack-200 hover:text-richblack-5 hover:bg-richblack-900/60"
              }`}
              key={index}
              onClick={() => setMyCards(tab)}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Course Cards Container with proper overlap positioning */}
      <div className="flex flex-wrap lg:flex-nowrap gap-8 justify-center items-stretch w-full mt-4 lg:mb-[-140px] z-10">
        {courses.map((element, index) => {
          return (
            <CourseCard
              key={index}
              cardData={element}
              currentCard={currentCard}
              setCurrentCard={setCurrentCard}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ExploreMore;
