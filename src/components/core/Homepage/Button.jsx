import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const CTAButton = ({ children, active, linkto, arrow = false }) => {
  return (
    <Link to={linkto}>
      <div
        className={`text-center text-[13px] sm:text-[15px] px-6 py-3 rounded-md font-semibold transition-all duration-200 hover:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] ${
          active
            ? "bg-yellow-400 text-richblack-900 shadow-none hover:shadow-none hover:bg-yellow-100"
            : "bg-richblack-800 text-richblack-100 hover:bg-richblack-700 border-b border-r border-richblack-700"
        }`}
      >
        <span>{children}</span>
        {arrow && <FaArrowRight className="text-xs" />}
      </div>
    </Link>
  );
};

export default CTAButton;