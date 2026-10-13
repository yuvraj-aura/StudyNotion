import HighlightText from "./HighlightText";
import CTAButton from "./Button";
import { FaArrowRight } from "react-icons/fa";

const InstructorSection = () => {
  return (
    <div className="mt-16">
      
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-center justify-between">

        {/* Left Side: Instructor Image with White Drop-Shadow / Frame */}

        <div className="w-full lg:w-[50%] flex justify-center">

          <div className="relative shadow-[-16px_-16px_0_0_#FFF] rounded-sm overflow-hidden bg-richblack-800 border border-richblack-700 max-w-120">

            <img
              src="/src/assets/Instructor.png"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80";
              }}
              alt="StudyNotion Instructor"
              className="object-cover h-95 sm:h-112.5 w-full"
            />
          </div>
        </div>

        {/* Right Side: Instructor Content */}
        <div className="w-full lg:w-[50%] flex flex-col gap-8">
          <div className="text-3xl sm:text-4xl font-semibold text-richblack-5 w-[85%]">
            Become an
            <HighlightText text={"Instructor"} />
          </div>

          <p className="font-medium text-[16px] w-[90%] text-richblack-300 leading-relaxed">
            Instructors from around the world teach millions of students on
            StudyNotion. We provide the tools and skills to teach what you love.
          </p>

          <div className="w-fit">
            <CTAButton active={true} linkto={"/signup"} arrow={true}>
              <div className="flex items-center gap-3">
                Start Teaching Today
              </div>
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSection;
