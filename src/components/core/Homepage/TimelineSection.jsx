import { FaAward, FaGraduationCap, FaDiamond, FaPuzzlePiece } from "react-icons/fa6";

const timeline = [
  {
    Logo: <FaAward className="text-caribbeangreen-300 text-2xl" />,
    heading: "Leadership",
    Description: "Fully committed to the success company",
  },
  {
    Logo: <FaGraduationCap className="text-pink-300 text-2xl" />,
    heading: "Responsibility",
    Description: "Students will always be our top priority",
  },
  {
    Logo: <FaDiamond className="text-yellow-100 text-2xl" />,
    heading: "Flexibility",
    Description: "The ability to switch is an important skill",
  },
  {
    Logo: <FaPuzzlePiece className="text-blue-200 text-2xl" />,
    heading: "Solve the problem",
    Description: "Code your way to a solution",
  },
];

const TimelineSection = () => {
  return (
    <div className="w-11/12 max-w-maxContent mx-auto my-20">
      <div className="flex flex-col lg:flex-row gap-16 items-center justify-between">
        {/* Left Side: Timeline List */}
        <div className="w-full lg:w-[45%] flex flex-col gap-8">
          {timeline.map((element, index) => {
            return (
              <div className="flex flex-col gap-3" key={index}>
                <div className="flex gap-6 items-center">
                  <div className="w-13 h-13 bg-white rounded-full flex justify-center items-center shadow-[0_0_62px_0_rgba(0,0,0,0.12)]">
                    {element.Logo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[18px] text-richblack-800">
                      {element.heading}
                    </h3>
                    <p className="text-base text-richblack-700">
                      {element.Description}
                    </p>
                  </div>
                </div>
                {index < timeline.length - 1 && (
                  <div className="hidden lg:block h-8 border-l border-dotted border-richblack-300 ml-6 w-0"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Side: Timeline Image with Green Overlay Box */}
        <div className="relative shadow-blue-200 w-full lg:w-[50%] flex justify-center">
          {/* Main Image with decorative shadow */}
          <div className="relative shadow-[16px_16px_0_0_#FFF] rounded-md overflow-hidden bg-richblack-800 border border-richblack-700">
            {/* Fallback image placeholder or referenced asset */}
            <img
              src="/src/assets/timelineImage.png"
              onError={(e) => {
                // If specific image not present, use elegant high-res SVG/placeholder
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80";
              }}
              alt="Timeline student learning"
              className="object-cover h-87.5 sm:h-105 w-full"
            />
          </div>

          {/* Floating Green Overlay Box */}
          <div className="absolute bg-[#014A32] text-white flex flex-col sm:flex-row uppercase py-6 sm:py-8 px-6 sm:px-10 gap-6 sm:gap-10 -bottom-8 lg:-bottom-12 rounded-sm shadow-[0_10px_20px_rgba(1,74,50,0.3)]">

            <div className="flex gap-5 items-center sm:border-r border-[#05A77B] sm:pr-8">

              <p className="text-3xl sm:text-4xl font-bold font-inter">10</p>
              <p className="text-[#05A77B] text-[13px] sm:text-[14px] leading-tight font-medium">
                Years of <br /> Experience
              </p>
              
            </div>

            <div className="flex gap-5 items-center">
              <p className="text-3xl sm:text-4xl font-bold font-inter">250</p>
              <p className="text-[#05A77B] text-[13px] sm:text-[14px] leading-tight font-medium">
                Types of <br /> Courses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineSection;
