import { Link } from "react-router-dom";
import logo from "../../assets/Logo.svg";
import { FooterLink2 } from "../../data/footer-links";
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube, FaHeart } from "react-icons/fa";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
    "Articles",
    "Blog",
    "Chart Sheet",
    "Code challenges",
    "Docs",
    "Projects",
    "Videos",
    "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];

const Footer = () => {
    return (
        <div className="bg-richblack-800 text-richblack-400 border-t border-richblack-700">
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-between w-11/12 max-w-maxContent text-richblack-400 leading-6 mx-auto py-14">
                {/* Left Half: Company, Resources, Plans, Community */}
                <div className="w-full lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pr-5 gap-4">
                    <div className="w-[45%] sm:w-[30%] flex flex-col gap-3">
                        <Link to="/">
                            <img src={logo} alt="StudyNotion Logo" className="object-contain" width={160} />
                        </Link>
                        <h4 className="text-richblack-50 font-semibold text-[16px] mt-2">
                            Company
                        </h4>
                        <div className="flex flex-col gap-2">
                            {["About", "Careers", "Affiliates"].map((ele, i) => {
                                return (
                                    <div
                                        key={i}
                                        className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                                    >
                                        <Link to={ele.toLowerCase()}>{ele}</Link>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex gap-3 text-lg mt-1 text-richblack-300">
                            <FaFacebook className="cursor-pointer hover:text-richblack-50" />
                            <FaGoogle className="cursor-pointer hover:text-richblack-50" />
                            <FaTwitter className="cursor-pointer hover:text-richblack-50" />
                            <FaYoutube className="cursor-pointer hover:text-richblack-50" />
                        </div>
                    </div>

                    <div className="w-[45%] sm:w-[30%] flex flex-col gap-3">
                        <h4 className="text-richblack-50 font-semibold text-[16px]">
                            Resources
                        </h4>
                        <div className="flex flex-col gap-2">
                            {Resources.map((ele, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                                    >
                                        <Link to={ele.split(" ").join("-").toLowerCase()}>
                                            {ele}
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>

                        <h4 className="text-richblack-50 font-semibold text-[16px] mt-4">
                            Support
                        </h4>
                        <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                            <Link to={"/help-center"}>Help Center</Link>
                        </div>
                    </div>

                    <div className="w-[45%] sm:w-[30%] flex flex-col gap-3">
                        <h4 className="text-richblack-50 font-semibold text-[16px]">
                            Plans
                        </h4>
                        <div className="flex flex-col gap-2">
                            {Plans.map((ele, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                                    >
                                        <Link to={ele.split(" ").join("-").toLowerCase()}>
                                            {ele}
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>

                        <h4 className="text-richblack-50 font-semibold text-[16px] mt-4">
                            Community
                        </h4>
                        <div className="flex flex-col gap-2">
                            {Community.map((ele, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                                    >
                                        <Link to={ele.split(" ").join("-").toLowerCase()}>
                                            {ele}
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Divider line in desktop */}
                <div className="hidden lg:block w-[1px] bg-richblack-700 min-h-[360px]"></div>

                {/* Right Half: Subjects, Languages, Career building */}
                <div className="w-[100%] lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-4">
                    {FooterLink2.map((ele, i) => {
                        return (
                            <div key={i} className="w-[45%] sm:w-[30%] flex flex-col gap-3">
                                <h4 className="text-richblack-50 font-semibold text-[16px]">
                                    {ele.title}
                                </h4>
                                <div className="flex flex-col gap-2">
                                    {ele.links.map((link, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200"
                                            >
                                                <Link to={link.link}>{link.title}</Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="w-11/12 max-w-maxContent mx-auto border-t border-richblack-700 py-6 flex flex-col sm:flex-row items-center justify-between text-[14px] text-richblack-300">
                <div className="flex gap-4">
                    {BottomFooter.map((ele, i) => {
                        return (
                            <div
                                key={i}
                                className={`cursor-pointer hover:text-richblack-50 transition-all duration-200 ${i !== BottomFooter.length - 1 ? "border-r border-richblack-700 pr-4" : ""
                                    }`}
                            >
                                <Link to={ele.split(" ").join("-").toLocaleLowerCase()}>
                                    {ele}
                                </Link>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-4 sm:mt-0 flex items-center gap-1.5 text-center">
                    <span>Made with</span>
                    <FaHeart className="text-[#EF476F] text-xs inline" />
                    <span>Target Technology © {new Date().getFullYear()} Studynotion</span>
                </div>
            </div>
        </div>
    );
};

export default Footer;
