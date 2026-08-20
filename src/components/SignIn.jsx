import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./SignIn.css";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { FcGoogle } from "react-icons/fc";

const SignIn = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [details, setDetails] = useState({
        emailId: "",
        password: "",
    })
    function changeHandler(event) {
        setDetails(prevDetails => (
            { ...prevDetails, [event.target.name]: event.target.value }
        ));
    }
    function submitHandler(e) {
        e.preventDefault();
        setIsLoggedIn(true);
        navigate('/dashboard');
        toast.success("Logged in sucessfully");
    }
    return (
        <div className='signin'>
            <div className='signin-container'>
                <div>
                    <h1>Welcome Back</h1>
                </div>
                <div>
                    <p>Build skills for today, tomorrow and future</p>
                    <p>Education to future-proof your career.</p>
                </div>
                <form onSubmit={submitHandler}>
                    <div>
                        <label htmlFor="email">Email Address <sup>*</sup></label>
                        <input
                            type="email"
                            value={details.emailId}
                            name="emailId"
                            id='emailId'
                            onChange={changeHandler}
                            required
                            placeholder='Enter email address'
                        />
                        
                    </div>

                    <div className='passwordField'>
                        <label htmlFor="password">Password <sup>*</sup></label>
                        <div className='password-input-wrapper'>
                            <input
                                type={showPass ? "text" : "password"}
                                value={details.password}
                                name="password"
                                id='password'
                                onChange={changeHandler}
                                required
                                placeholder='Enter password'
                            />
                            <span className='showPassword' onClick={() => {
                                setShowPass(!showPass)
                            }}>
                                {
                                    showPass ? (
                                        <FaRegEye size={20} />
                                    ) : (
                                        <FaRegEyeSlash size={20} />
                                    )
                                }
                            </span>
                        </div>
                    </div>


                    <button>Sign In</button>
                </form>

                <div className='separation'>
                    <div></div>
                    <span>OR</span>
                    <div></div>
                </div>

                <button>
                    <FcGoogle size={25}/>
                    <span>Sign in with Google</span>
                </button>
            </div>

            <div className='rightImg'>
                <img className='signin-image' src="src\assets\login.png" alt="" />
                <img className='signin-frame' src="src\assets\frame.png" alt="" />
            </div>
        </div>
    )
}

export default SignIn