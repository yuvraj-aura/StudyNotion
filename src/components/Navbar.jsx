import { Link } from 'react-router-dom';
import logo from "../assets/Logo.svg";
import { toast } from 'react-toastify';
import "./Navbar.css";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {

    return (
        <div>
            <nav>
                <div className="logo">
                    <Link to="/">
                        <img src={logo} alt="StudyNotion" width={160} height={32} loading="lazy" />
                    </Link>
                </div>
                <div className="navigation">
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                        <li>
                            <Link to="/contact">Contact</Link>
                        </li>
                    </ul>
                </div>
                <div className="authenticate">
                    {
                        isLoggedIn &&
                        <Link to="/">
                            <button
                                onClick={() => {
                                    setIsLoggedIn(false);
                                    toast.success("Logged Out Successfully");
                                }}
                            >Log Out</button>
                        </Link>
                    }
                    {
                        !isLoggedIn &&
                        <Link to="/signin">
                            <button>Sign In</button>
                        </Link>

                    }
                    {
                        isLoggedIn &&
                        <Link to="/dashboard">
                            <button>Dashboard</button>
                        </Link>

                    }
                    {
                        !isLoggedIn &&
                        <Link to="/signup">
                            <button>Sign Up</button>
                        </Link>

                    }
                </div>
            </nav>
        </div>
    )
}

export default Navbar