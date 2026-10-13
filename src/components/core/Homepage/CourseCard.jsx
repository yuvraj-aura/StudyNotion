import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";

const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
  const isSelected = currentCard === cardData.heading;

  return (
    <div
      onClick={() => setCurrentCard(cardData.heading)}
      className={`w-full max-w-[350px] lg:w-[32%] text-richblack-25 min-h-[300px] box-border cursor-pointer transition-all duration-300 flex flex-col justify-between rounded-sm ${
        isSelected
          ? "bg-white text-richblack-800 shadow-[12px_12px_0_0_#FFD60A] scale-[1.02]"
          : "bg-richblack-800 text-richblack-400 hover:bg-richblack-700/80 shadow-md"
      }`}
    >
      <div className="flex flex-col gap-3 p-6">
        <div
          className={`font-semibold text-[20px] ${
            isSelected ? "text-richblack-800" : "text-richblack-25"
          }`}
        >
          {cardData.heading}
        </div>
        <p className="text-richblack-400 text-[14px] leading-relaxed">
          {cardData.description}
        </p>
      </div>

      <div
        className={`flex justify-between items-center px-6 py-4 border-t-2 border-dashed ${
          isSelected
            ? "border-richblack-100 text-blue-200"
            : "border-richblack-700 text-richblack-300"
        } font-medium`}
      >
        <div className="flex items-center gap-2 text-[14px]">
          <HiUsers />
          <p>{cardData.level}</p>
        </div>
        <div className="flex items-center gap-2 text-[14px]">
          <ImTree />
          <p>{cardData.lessonNumber} Lessons</p>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
