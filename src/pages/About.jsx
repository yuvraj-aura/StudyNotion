import React from 'react';
import { FaGraduationCap, FaLightbulb, FaHeart, FaRocket, FaGlobe, FaShieldAlt } from 'react-icons/fa';
import HighlightText from '../components/core/Homepage/HighlightText';
import ReviewSlider from "../components/core/Homepage/ReviewSlider";
import Footer from "../components/common/Footer"

const stats = [
    { count: "5K+", label: "Active Students" },
    { count: "10+", label: "Mentors" },
    { count: "200+", label: "Courses" },
    { count: "50+", label: "Awards & Recognition" },
];

const values = [
    {
        icon: <FaGraduationCap className="text-2xl text-yellow-50" />,
        title: "Quality Education",
        desc: "Delivering high-caliber curriculum crafted by industry pioneers and top educators worldwide."
    },
    {
        icon: <FaGlobe className="text-2xl text-caribbeangreen-200" />,
        title: "Accessibility for All",
        desc: "Making world-class learning affordable, inclusive, and readily available to anyone, anywhere."
    },
    {
        icon: <FaShieldAlt className="text-2xl text-blue-100" />,
        title: "Integrity & Trust",
        desc: "Providing transparent pathways, verified credentials, and honest one-on-one mentorship."
    },
    {
        icon: <FaHeart className="text-2xl text-pink-200" />,
        title: "Community First",
        desc: "Fostering an empowering space where ambitious learners collaborate, build, and grow together."
    }
];

const About = () => {
    return (
        <div className="w-full relative bg-richblack-900 text-richblack-5 font-inter">
            {/* ========================================================
                    SECTION 1 : Hero Header Banner
            ======================================================== */}

            <section className="relative isolate bg-richblack-800 border-b border-richblack-700">

                {/* Hero heading and description */}
                {/* ✅ CHANGED: Added extra bottom padding to make room for images overlapping the next section */}
                <div className="relative mx-auto flex w-11/12 max-w-320 flex-col items-center justify-center text-center pt-20 pb-48 md:pb-56 lg:pb-64">

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-richblack-5 max-w-225 leading-tight">
                        Driving Innovation in Online Education for a{" "}
                        <HighlightText text={"Brighter Future"} />
                    </h1>

                    <p className="mt-5 max-w-205 text-base md:text-md text-richblack-300 font-medium leading-relaxed">
                        StudyNotion is at the forefront of driving innovation in online education. We're passionate about creating a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.
                    </p>

                </div>

                {/* ====================================================
                                OVERLAPPING IMAGES
                ==================================================== */}

                {/* ✅ CHANGED: Absolute positioning anchors the images
        to the bottom edge of the hero section */}
                <div className="absolute left-1/2 bottom-0 z-20 w-full max-w-300 -translate-x-1/2 translate-y-1/2 ml-5">

                    <div className="relative grid grid-cols-3 items-center gap-3 sm:gap-4 lg:gap-6">

                        {/* ✅ ADDED: Cyan glow behind first image */}
                        <div className="pointer-events-none absolute left-[12%] top-1/2 -z-10 h-32 w-32 -translate-y-1/2 rounded-full bg-cyan-400/30 blur-3xl sm:h-48 sm:w-48" />

                        {/* ✅ ADDED: Golden glow behind center image */}
                        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/25 blur-3xl sm:h-62 sm:w-62" />

                        {/* ✅ ADDED: Blue glow behind third image */}
                        <div className="pointer-events-none absolute right-[12%] top-1/2 -z-10 h-32 w-32 -translate-y-1/2 rounded-full bg-sky-400/30 blur-3xl sm:h-48 sm:w-48" />

                        {/* Image 1 */}
                        {/* ✅ CHANGED: Added rounded corners and floating shadow */}
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsfotSVFVZlrxN_G27rSMMwhD4BAAAtZbYZ42NGb2gbQ&s=10"
                            alt="Student learning with technology"
                            className="relative z-10 w-[85%] aspect-[4/3] -top-[60px] left-[70px] object-cover rounded-lg sm:rounded-xl shadow-[0_18px_35px_-10px_rgba(0,0,0,0.7)]"
                        />

                        {/* Image 2 */}
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMxicGODPljaFTNzy-Wt22GBpQchAQp_z58rj3Ae-whw&s=10"
                            alt="Student studying at a table"
                            className="relative z-10 w-[85%] aspect-[4/3] -top-[60px] left-[40px] object-cover rounded-lg sm:rounded-xl shadow-[0_18px_35px_-10px_rgba(0,0,0,0.7)]"
                        />

                        {/* Image 3 */}
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPSw1WzdkHao5e4bX2HyOIWiw_qHdBU-pUOjeVJqcxiQ&s=10"
                            alt="Student writing notes"
                            className="relative z-10 w-[85%] aspect-[4/3] -top-[60px] object-cover rounded-lg sm:rounded-xl shadow-[0_18px_35px_-10px_rgba(0,0,0,0.7)]"
                        />

                    </div>
                </div>

            </section>


            {/* ========================================================
          SECTION 2 : Quote Banner
      ======================================================== */}
            <section className="border-b border-richblack-700">
                <div className="mx-auto w-11/12 max-w-315 py-20 lg:py-24 text-center">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-richblack-100 leading-snug md:leading-normal max-w-262.5 mx-auto mt-5">
                        <span className="text-richblack-500 text-4xl sm:text-5xl select-none mr-2 font-serif">“</span>
                        We are passionate about revolutionizing the way we learn. Our innovative platform combines{" "}
                        <span className="bg-linear-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text font-bold">
                            technology
                        </span>
                        ,{" "}
                        <span className="bg-linear-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold">
                            expertise
                        </span>
                        , and community to create an{" "}
                        <span className="bg-linear-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold">
                            unparalleled educational experience
                        </span>
                        .
                        <span className="text-richblack-500 text-4xl sm:text-5xl select-none ml-2 font-serif">”</span>
                    </p>
                </div>
            </section>

            {/* ========================================================
          SECTION 3 : Founding Story & Vision/Mission
      ======================================================== */}
            <section className="mx-auto w-11/12 max-w-[1260px] py-20 lg:py-28">
                <div className="flex flex-col lg:flex-row gap-14 lg:gap-20 items-stretch justify-between">
                    {/* Founding Story Card */}
                    <div className="flex-1 flex flex-col justify-between rounded-2xl bg-richblack-800 p-8 sm:p-10 border border-richblack-700/80 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-richblack-600 transition-all duration-300">
                        <div>
                            <div className="w-14 h-14 rounded-xl bg-pink-900/30 border border-pink-700/40 flex items-center justify-center text-pink-200 mb-6">
                                <FaLightbulb size={24} />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-richblack-5 mb-4">
                                Our Founding Story
                            </h2>
                            <p className="text-richblack-300 text-base leading-relaxed mb-4">
                                Our e-learning platform was born out of a shared vision and a passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.
                            </p>
                            <p className="text-richblack-300 text-base leading-relaxed">
                                As experienced educators ourselves, we witnessed firsthand the limitations and challenges of traditional education systems. We believed that education should not be confined to the walls of a classroom or limited by geographical boundaries.
                            </p>
                        </div>
                    </div>

                    {/* Vision & Mission Card */}
                    <div className="flex-1 flex flex-col justify-between rounded-2xl bg-richblack-800 p-8 sm:p-10 border border-richblack-700/80 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-richblack-600 transition-all duration-300">
                        <div>
                            <div className="w-14 h-14 rounded-xl bg-blue-900/30 border border-blue-700/40 flex items-center justify-center text-blue-100 mb-6">
                                <FaRocket size={24} />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-semibold text-richblack-5 mb-4">
                                Our Vision & Mission
                            </h2>
                            <p className="text-richblack-300 text-base leading-relaxed mb-4">
                                With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our mission goes beyond just delivering courses online; we wanted to create a vibrant community of collaborative learners.
                            </p>
                            <p className="text-richblack-300 text-base leading-relaxed">
                                Our vision is to empower individuals from all backgrounds to unlock their full potential and shape a brighter future through continuous skill acquisition, industry-standard projects, and personalized mentorship.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================
          SECTION 4 : Stats Counter Banner
      ======================================================== */}
            <section className="bg-richblack-800 border-y border-richblack-700 py-16">
                <div className="mx-auto w-11/12 max-w-[1260px]">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-richblack-5 font-inter">
                                    {stat.count}
                                </h3>
                                <p className="mt-2 text-sm sm:text-base font-medium text-richblack-400">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========================================================
          SECTION 5 : Core Values Grid
      ======================================================== */}
            <section className="mx-auto w-11/12 max-w-[1260px] py-20 lg:py-28">
                <div className="text-center mb-16">
                    <span className="text-xs font-semibold uppercase tracking-wider text-yellow-50 bg-richblack-800 border border-richblack-700 px-3.5 py-1 rounded-full">
                        Our Values
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-semibold text-richblack-5 mt-4">
                        The Principles That Drive Everything We Do
                    </h2>
                    <p className="mt-3 text-base text-richblack-300 max-w-[620px] mx-auto">
                        Guiding our commitment to empower learners with industry knowledge and trusted skill-sets.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((val, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col p-7 rounded-xl bg-richblack-800 border border-richblack-700/60 shadow-md hover:border-richblack-500 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-lg bg-richblack-700 flex items-center justify-center mb-5">
                                {val.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-richblack-5 mb-2.5">
                                {val.title}
                            </h3>
                            <p className="text-sm text-richblack-300 leading-relaxed">
                                {val.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <div>
                <h2>What Others say about us</h2>
                <div>
                    <ReviewSlider />
                </div>
            </div>


            <Footer />
        </div>
    );
};

export default About;



// add reviews too here 