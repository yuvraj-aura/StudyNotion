import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighlightText from "../components/core/Homepage/HighlightText";
import CTAButton from "../components/core/Homepage/Button";
import CodeBlocks from "../components/core/Homepage/CodeBlocks";
import ExploreMore from "../components/core/Homepage/ExploreMore";
import TimelineSection from "../components/core/Homepage/TimelineSection";
import LearningLanguageSection from "../components/core/Homepage/LearningLanguageSection";
import InstructorSection from "../components/core/Homepage/InstructorSection";
import ReviewSlider from "../components/core/Homepage/ReviewSlider";
 
const Home = () => {
  return (
    <div className="w-full min-h-screen bg-richblack-900 text-white font-inter">
      {/* ========================================================
          SECTION 1 : Dark Section (Hero, Video Banner, 2 CodeBlocks, ExploreMore)
      ======================================================== */}
      <div className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center justify-between text-white"> 
        
        {/* Become an Instructor Badge */}
        <Link to="/signup">
          <div className="group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit border border-richblack-700 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.18)]">
            <div className="flex flex-row items-center gap-2 rounded-full px-7 sm:px-10 py-1.25 transition-all duration-200 group-hover:bg-richblack-900">
              <p className="text-[14px]">Become an Instructor</p>
              <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        {/* Hero Heading */}
        <div className="text-center text-3xl sm:text-4xl md:text-[38px] font-semibold mt-8 tracking-tight">
          Empower Your Future with <HighlightText text={"Coding Skills"} />
        </div>

        {/* Hero Subheading */}
        <div className="mt-4 w-[90%] md:w-[75%] text-center text-base md:text-lg font-medium text-richblack-300 leading-relaxed">
          With our online coding courses, you can learn at your own pace, from anywhere
          in the world, and get access to a wealth of resources, including hands-on
          projects, quizzes, and personalized feedback from instructors.
        </div>

        {/* Hero Buttons */}
        <div className="flex flex-row gap-5 sm:gap-7 mt-8">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>
          <CTAButton active={false} linkto={"/signin"}>
            Book a Demo
          </CTAButton>
        </div>

        {/* Hero Video with Gradient Background Blur & Border Frame */}
        <div className="mx-3 my-12 sm:my-16 shadow-[10px_-5px_50px_-5px] shadow-blue-200 relative w-full max-w-[1020px]">
          {/* Decorative white/glow offset border matching reference UI */}
          <div className="relative shadow-[20px_20px_0px_0px_#FFF] rounded-sm overflow-hidden bg-richblack-800">
            <video
              className="w-full h-auto object-cover max-h-[500px]"
              muted
              loop
              autoPlay
              playsInline
              src="/src/assets/banner.mp4"
              onError={(e) => {
                // If video file is not added yet, display reference fallback thumbnail
                e.target.style.display = "none";
                const fallbackImg = document.getElementById("banner-fallback-img");
                if (fallbackImg) fallbackImg.style.display = "block";
              }}
            />
            {/* Fallback image if banner.mp4 is not yet provided in src/assets */}
            <img
              id="banner-fallback-img"
              src="/src/assets/hero-image-1.avif"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80";
              }}
              alt="StudyNotion Coding Bootcamp"
              className="w-full h-[280px] sm:h-[450px] object-cover"
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* Code Section 1 */}
        <div className="w-full">
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-3xl sm:text-4xl font-semibold">
                Unlock your <HighlightText text={"coding potential"} /> with our
                online courses.
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={{
              btnText: "Try it Yourself",
              linkto: "/signup",
              active: true,
              arrow: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              linkto: "/signin",
              active: false,
            }}
            codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n<link rel="stylesheet" href="styles.css">\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav>\n  <a href="one/">One</a>\n  <a href="two/">Two</a>\n  <a href="three/">Three</a>\n</nav>\n</body>\n</html>`}
            codeColor={"text-yellow-25"}
            backgroundGradient={"bg-[#ccae1b]"}
          />
        </div>

        {/* Code Section 2 */}
        <div className="w-full">
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="text-3xl sm:text-4xl font-semibold">
                Start <HighlightText text={"coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: "Continue Lesson",
              linkto: "/signup",
              active: true,
              arrow: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              linkto: "/signin",
              active: false,
            }}
            codeblock={`import React from "react";\nimport CTAButton from "./Button";\n\nconst App = () => {\n\treturn (\n\t\t<div className="study-notion">\n\t\t<h1>Learn Coding With Confidence</h1>\n      <CTAButton active={true} linkto="/signup">\n        Get Started Today\n      </CTAButton>\n    </div>\n  );\n};\nexport default App;`}
            codeColor={"text-[#05A77B]"}
            backgroundGradient={"bg-[#0078e0]"}
          />
        </div>
        {/* #004E92 old bg gread code  */}
        {/* Explore More (Tab and 3 Card section overlap) */}
        <div className="w-full">
          <ExploreMore />
        </div>
      </div>

      {/* ========================================================
          SECTION 2 : Light Section (Pure White background)
      ======================================================== */}
      <div className="bg-pure-greys-5 text-richblack-700">
        
        {/* Diamond Grid Pattern / Background Banner with Explore Catalog & Learn More */}
        <div className="homepage_bg h-77.5 w-full flex items-center justify-center bg-radial from-richblack-800 to-richblack-900 border-b border-richblack-700">

          <div className="w-11/12 mt-28 max-w-maxContent flex items-center justify-center gap-7 text-white">

            <CTAButton active={true} linkto={"/signup"} arrow={true}>
              <div className="flex items-center gap-3">
                Explore Full Catalog
              </div>
            </CTAButton>

            <CTAButton active={false} linkto={"/signin"}>
              <div>Learn More</div>
            </CTAButton>
          </div>
        </div>

        {/* Content Container */}
        <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-8 py-16">
          
          {/* 2-Column Heading Row: "Get the skills you need for a job that is in demand" */}
          <div className="mb-4 flex flex-col lg:flex-row justify-between gap-7 w-full">
            <div className="text-3xl sm:text-4xl font-semibold lg:w-[45%] text-richblack-900 leading-tight">
              Get the skills you need for a{" "}
              <HighlightText text={"job that is in demand."} />
            </div>

            <div className="flex flex-col items-start gap-8 lg:w-[45%]">
              <p className="text-[16px] text-richblack-700 leading-relaxed">
                The modern StudyNotion dictates its own terms. Today, to be a
                competitive specialist requires more than professional skills.
              </p>
              <CTAButton active={true} linkto={"/signup"}>
                Learn More
              </CTAButton>
            </div>
          </div>

          {/* Timeline Section */}
          <TimelineSection />

          {/* Swiss Knife Language Section */}
          <LearningLanguageSection />
        </div>
      </div>

      {/* ========================================================
          SECTION 3 : Dark Section (Instructor & Reviews)
      ======================================================== */}
      <div className="w-11/12 mx-auto max-w-maxContent flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white ">
        {/* Become an Instructor */}
        <div className="w-full">
          <InstructorSection />
        </div>

        {/* Reviews from other learners */}
        <div className="w-full">
          <ReviewSlider />
        </div>
      </div>
    </div>
  );
};

export default Home;
