import HighlightText from "./HighlightText";
import CTAButton from "./Button";
import calender from "../../../assets/calender.png";
import progress from "../../../assets/progress.png";
import community from "../../../assets/community.png";


const LearningLanguageSection = () => {
  return (
    <div className="mt-32.5 mb-32">

      <div className="flex flex-col gap-5 items-center">

        {/* Heading */}
        <div className="text-3xl sm:text-4xl font-semibold text-center text-richblack-900">

          Your swiss knife for
          <HighlightText text={"learning any language"} />
        </div>

        {/* Subtitle */}
        <div className="text-center text-richblack-600 mx-auto text-base font-medium w-[90%] sm:w-[70%]">
          Using spin making learning multiple languages easy. With 20+ languages
          realistic voice-over, progress tracking, custom schedule and more.
        </div>

        {/* Cards container mimicking the 3 angled feature widgets */}
        <div className="flex flex-col lg:flex-row items-center justify-center mt-8 lg:mt-12 relative w-full max-w-250 mb-4">
          {/* Card 1: Know your progress */}
          <div className="lg:-mr-28 -mb-10 lg:mb-0 transition-transform duration-300 hover:z-20 hover:scale-105 rounded-3xl">
            <img
              src={progress}
              onError={(e) => {
                e.target.onerror = null;
                // Graceful fallback illustration widget
                e.target.src = "https://placehold.co/320x340/161D29/FFF?text=Know+Your+Progress";
              }}
              alt="Know your progress widget"
              className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] max-h-160  h-72 rotate-16 -translate-x-36"
            />
          </div>

          {/* Card 2: Compare with others */}
          <div className="transition-transform duration-300 hover:z-20 hover:scale-105 z-10">
            <img
              src={community}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/320x360/161D29/FFF?text=Compare+With+Others";
              }}
              alt="Compare with others widget"
              className="object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.2)] max-h-80 rounded-2xl -rotate-12"
            />
          </div>

          {/* Card 3: Plan your lessons */}
          <div className="lg:-ml-28 -mt-10 lg:mt-0 transition-transform duration-300 hover:z-20 hover:scale-105 z-100">
            <img
              src={calender}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/320x340/161D29/FFF?text=Plan+Your+Lessons";
              }}
              alt="Plan your lessons calendar"
              className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] max-h-80 rounded-2xl rotate-12 translate-x-36"
            />
          </div>
        </div>

        {/* CTA Button */}
        <div className="w-fit mt-16 -mb-10">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>
        </div>
      </div>
    </div>
  );
};

export default LearningLanguageSection;
