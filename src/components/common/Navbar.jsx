import { Link, matchPath, useLocation } from "react-router-dom";
import logo from "../../assets/Logo.svg";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { FaCartShopping } from "react-icons/fa6";
import ProfileDropdown from "../core/Auth/ProfileDropdown";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/APIs";
import { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Default fallback categories matching platform reference
  const fallbackCategories = [
    { title: "Python", link: "/catalog/python" },
    { title: "Web Development", link: "/catalog/web-development" },
    { title: "Android Development", link: "/catalog/android-development" },
    { title: "Blockchain", link: "/catalog/blockchain" },
    { title: "Artificial Intelligence", link: "/catalog/artificial-intelligence" },
    { title: "Data Science", link: "/catalog/data-science" },
    { title: "Cloud Computing", link: "/catalog/cloud-computing" },
    { title: "DevOps", link: "/catalog/devops" },
  ];

  const fetchSubLinks = async () => {
    setLoading(true);
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      if (result?.data?.data && result.data.data.length > 0) {
        setSubLinks(result.data.data);
      } else {
        setSubLinks(fallbackCategories);
      }
    } catch (error) {
      // Gracefully use fallback categories on local or offline dev
      setSubLinks(fallbackCategories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubLinks();
  }, []);

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  return (
    <div className="flex h-16 items-center justify-center border-b border-b-richblack-700 bg-richblack-900 sticky top-0 z-50 transition-all duration-200">
      <div className="flex w-11/12 max-w-[1260px] items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="StudyNotion" width={160} height={32} loading="lazy" />
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25 font-medium text-[15px] items-center">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div className="relative flex items-center gap-1 group hover:cursor-pointer hover:text-yellow-25 transition-all duration-200 py-2">
                    <p>{link.title}</p>
                    <IoIosArrowDown className="text-xs transition-transform duration-200 group-hover:rotate-180" />

                    {/* Dropdown Container */}
                    <div className="invisible translate-y-3 opacity-0 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 absolute left-1/2 -translate-x-1/2 top-full flex flex-col rounded-xl bg-richblack-5 p-4 text-richblack-900 shadow-2xl transition-all duration-300 w-[240px] z-50">
                      {/* Triangle Pointer */}
                      <div className="absolute left-1/2 -top-2 -translate-x-1/2 h-4 w-4 rotate-45 rounded-xs bg-richblack-5"></div>

                      {loading ? (
                        <p className="text-center text-sm py-2 text-richblack-600">
                          Loading...
                        </p>
                      ) : subLinks?.length > 0 ? (
                        <div className="flex flex-col gap-1 z-10 relative">
                          {subLinks.map((subLink, i) => {
                            const linkPath =
                              subLink.link ||
                              `/catalog/${subLink.name?.split(" ").join("-").toLowerCase()}`;
                            return (
                              <Link
                                to={linkPath}
                                key={i}
                                className="rounded-lg py-2 px-3 text-sm font-medium text-richblack-900 hover:bg-richblack-50 transition-colors duration-150"
                              >
                                {subLink.title || subLink.name}
                              </Link>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-center text-sm py-2 text-richblack-600">
                          No Categories Found
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`relative py-1 transition-all duration-200 ${
                        matchRoute(link?.path)
                          ? "text-yellow-25 font-semibold"
                          : "text-richblack-25 hover:text-yellow-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Login / SignUp / Cart / Profile Dropdown */}
        <div className="flex items-center gap-x-4">
          {user && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative mr-2 text-richblack-100 hover:text-richblack-25 text-lg">
              <FaCartShopping />
              {totalItems > 0 && (
                <span className="absolute bottom-1 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-green-600 text-center text-xs font-bold text-white animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {token === null && (
            <Link to="/signin">
              <button className="rounded-lg border border-richblack-700 bg-richblack-800 px-3.5 py-1.5 text-[14px] font-medium text-richblack-100 hover:bg-richblack-700 hover:text-white transition-all duration-200 cursor-pointer">
                Sign In
              </button>
            </Link>
          )}

          {token === null && (
            <Link to="/signup">
              <button className="rounded-lg border border-richblack-700 bg-richblack-800 px-3.5 py-1.5 text-[14px] font-medium text-richblack-100 hover:bg-richblack-700 hover:text-white transition-all duration-200 cursor-pointer">
                Sign Up
              </button>
            </Link>
          )}

          {token !== null && <ProfileDropdown />}
        </div>
      </div>
    </div>
  );
};

export default Navbar;