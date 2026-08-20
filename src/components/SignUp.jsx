import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./SignUp.css";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { FcGoogle } from "react-icons/fc";

const SignUp = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();
    
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [accountType, setAccountType] = useState("Student");

    const [details, setDetails] = useState({
        firstName: "",
        lastName: "",
        emailId: "",
        password: "",
        confirmPass: "",
    })

    function changeHandler(event) {
        setDetails(prevDetails => (
            { ...prevDetails, [event.target.name]: event.target.value }
        ));
    }

    function submitHandler(e) {
        e.preventDefault();
        if (details.password !== details.confirmPass){
            toast.error("Password do not match");
            return;
        }else{
            toast.success("Account Created sucessfully");
            navigate('/signin');
        }

        const accountData = {
            ...details,
            accountType
        }
    }
    return (
        <div className='signup'>
            <div className='backSide'>
                <div>
                    <h1>Join with millions learning to code with StudyNotion for free</h1>
                </div>
                <div>
                    <p>Build skills for today, tomorrow and future</p>
                    <p>Education to future-proof your career.</p>
                </div>

                <div>
                    <button className='student' onClick={() => setAccountType("Student")}>Student</button>
                    <button className='instructor' onClick={() => setAccountType("Instructor")}>Instructor</button>
                </div>

                <form onSubmit={submitHandler}>
                    <div>
                        <label htmlFor="firstName">First Name <sup>*</sup></label>
                        <input
                            type="text"
                            value={details.firstName}
                            name="firstName"
                            id='firstName'
                            onChange={changeHandler}
                            required
                            placeholder='Enter first name'
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName">Last Name <sup>*</sup></label>
                        <input
                            type="text"
                            value={details.lastName}
                            name="lastName"
                            id='lastName'
                            onChange={changeHandler}
                            required
                            placeholder='Enter last name'
                        />
                    </div>
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
                    <div>
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
                        <div className='passwordField'>
                            <label htmlFor="confirmPass">Confirm Password <sup>*</sup></label>
                            <div className='password-input-wrapper'>
                                <input
                                    type={showConfirmPass ? "text" : "password"}
                                    value={details.confirmPass}
                                    name="confirmPass"
                                    id='confirmPass'
                                    onChange={changeHandler}
                                    required
                                    placeholder='Confirm password'
                                />
                                <span className='showPassword' onClick={() => {
                                    setShowConfirmPass(!showConfirmPass)
                                }}>
                                    {
                                        showConfirmPass ? (
                                            <FaRegEye size={20} />
                                        ) : (
                                            <FaRegEyeSlash size={20} />
                                        )
                                    }
                                </span>
                            </div>
                        </div>

                    </div>

                    <button>Create Account</button>
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
                <img className='signup-image' src="src\assets\signup.png" alt="" />
                <img className='signup-frame' src="src\assets\frame.png" alt="" />
            </div>
        </div>
    )
}

export default SignUp