import CTAButton from "./Button";
import { TypeAnimation } from "react-type-animation";

const CodeBlocks = ({
  position,
  heading,
  subheading,
  ctabtn1,
  ctabtn2,
  codeblock,
  backgroundGradient,
  codeColor,
}) => {
  const lines = codeblock.split("\n");

  return (
    <div className={`flex ${position} my-24 justify-between flex-col lg:gap-14 gap-10 items-center`}>

      {/* Section 1: Text & Buttons */}
      <div className="w-full lg:w-[48%] flex flex-col gap-6">
        {heading}
        <div className="text-richblack-300 text-base font-medium leading-relaxed">
          {subheading}
        </div>

        <div className="flex flex-wrap gap-5 mt-4">
          <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto} arrow={ctabtn1.arrow}>
            {ctabtn1.btnText}
          </CTAButton>
          <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
            {ctabtn2.btnText}
          </CTAButton>
        </div>
      </div>

      {/* Section 2: Code Editor Window */}
      <div className="h-fit code-border flex flex-row py-4 px-2 text-[12px] sm:text-[14px] leading-[22px] sm:leading-6 relative w-full lg:w-125 bg-richblack-800/60 rounded-xl border border-richblack-700/60 backdrop-blur-md shadow-2xl">
        {/* Glow Effect */}
        <div
          className={`absolute w-[360px] h-[260px] rounded-full blur-3xl opacity-25 -top-10 -left-10 pointer-events-none ${
            backgroundGradient || "bg-yellow-200"
          }`}
        ></div>

        {/* Index Column */}
        <div className="text-center flex flex-col w-[12%] select-none text-richblack-400 font-inter font-bold pr-2 border-r border-richblack-700/50">
          {lines.map((_, index) => (
            <p key={index} className="leading-[22px] sm:leading-6">{index + 1}</p>
          ))}
        </div>

        {/* Code Content */}
        <div
          className={`w-[88%] flex flex-col font-bold font-mono ${codeColor} pl-4 overflow-x-auto`}
        >
          <TypeAnimation 
            sequence={[codeblock, 5000, ""]}
            repeat={Infinity}
            cursor={true}
            style = {
              {
                whiteSpace: "pre-line",
                display: "block",
              }
            }
            omitDeletionAnimation={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;
