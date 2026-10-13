import { Link, matchPath } from 'react-router-dom';
import logo from "../../assets/Logo.svg";
import { NavbarLinks } from '../../data/navbar-links';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaCartShopping } from "react-icons/fa6";
import ProfileDropdown from '../core/Auth/ProfileDropdown';
import { apiConnector } from '../../services/apiConnector';
import { categories } from '../../services/APIs';
import { useState, useEffect } from 'react';
import { IoIosArrowDown } from "react-icons/io";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const location = useLocation();
    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    }

    const [subLinks, setSubLinks] = useState([]);

    const fetchSubLinks = async () => {
        try {
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            console.log("Printing Sublinks result ->> ", result);
            setSubLinks(result.data.data);
        } catch (error) {
            console.log("Could not fetch the category list");
        }
    }
    useEffect(() => {
        fetchSubLinks();
    })

    const sublinks = [
        {
            title: "python",
            link: "/catalog/python",
        },
        {
            title: "Web Development",
            link: "/catalog/web-development",
        }
    ]

    // destructuring states from their slices
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector(((state) => state.profile));
    const { totalItem } = useSelector(((state) => state.cart));

    return (
        <div className="flex h-16 items-center justify-center border-b border-b-richblack-700 bg-richblack-900 sticky top-0 z-50 transition-all duration-200">
            <div className="flex w-11/12 max-w-315 items-center justify-between">

                {/* Logo */}
                <Link to="/">
                    <img src={logo} alt="StudyNotion" width={160} height={32} loading="lazy" />
                </Link>

                {/* Nav Links */}
                <nav>
                    <ul className="flex gap-x-6 text-richblack-25 font-medium text-[15px] items-center ">
                        {
                            NavbarLinks.map((link, index) => (
                                <li key={index}>
                                    {
                                        link.title === 'Catalog' ? (
                                            <div className='relative flex items-center gap-2 group hover:cursor-pointer  hover:text-blue-500 transition-all duration-200'>
                                                <p>{link.title}</p>
                                                <IoIosArrowDown />

                                                <div className='invisible translate-x-[-50%] translate-y-[80%] absolute left-[50%] top-[50%] flex flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[320px]'>
                                                    <div className='absolute left-[50%] top-0 translate-x-[80%] translate-y-[-35%] h-6 w-6 rotate-45 rounded bg-richblack-5'>
                                                        {
                                                            sublinks.length > 0 ? (
                                                                sublinks.map((subLink, index) => {
                                                                    <Link to={`${subLink.link}`} key={index}>
                                                                        <p>{subLink.title}</p>    
                                                                    </Link>
                                                                })
                                                            ) : (<div></div>)
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <Link to={link?.path}>
                                                <p className={`relative py-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-left after:scale-x-0 after:bg-yellow-200 after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 ${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"} hover:text-blue-500 transition-all duration-200`} >{link.title}</p>
                                            </Link>
                                        )
                                    }
                                </li>
                            ))
                        }
                    </ul>
                </nav>

                {/* Login / SignUp / Dashboard / Logout Buttons */}
                <div className="flex items-center gap-x-4">
                    { // Signin
                        token === null && (
                            <Link to="/signin">
                                <button className="rounded-lg border border-richblack-700 bg-richblack-800 px-3.5 py-1 text-[14px] font-medium text-richblack-100 hover:bg-richblack-700 hover:text-white transition-all duration-200 cursor-pointer">
                                    Sign In
                                </button>
                            </Link>
                        )
                    }
                    { // Signup
                        token === null && (
                            <Link to="/signup">
                                <button className="rounded-lg border border-richblack-700 bg-richblack-800 px-3.5 py-1 text-[14px] font-medium text-richblack-100 hover:bg-richblack-700 hover:text-white transition-all duration-200 cursor-pointer">
                                    Sign Up
                                </button>
                            </Link>
                        )
                    }
                    {   // for shopping cart
                        user && user?.accountType != "Instructor" && (
                            <Link to="/dashboard/cart" className='relative' >
                                <FaCartShopping />
                                {
                                    totalItem > 0 && (
                                        <span>
                                            {totalItem}
                                        </span>
                                    )
                                }
                            </Link>
                        )
                    }
                    {
                        token !== null && <ProfileDropdown />
                    }
                    { // log out
                        token !== null && (
                            <Link to="/">
                                <button
                                    onClick={() => {
                                        setIsLoggedIn(false);
                                        toast.success("Logged Out Successfully");
                                    }}
                                    className="rounded-lg border border-richblack-700 bg-richblack-800 px-3.5 py-lg text-[14px] font-medium text-richblack-100 hover:bg-richblack-700 hover:text-white transition-all duration-200 cursor-pointer"
                                >
                                    Log Out
                                </button>
                            </Link>
                        )
                    }

                </div>
            </div>
        </div>
    );
};

export default Navbar;