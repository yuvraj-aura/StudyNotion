import { useEffect, useState, useCallback } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import OpenRoute from "./components/core/Auth/OpenRoute";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from './pages/Dashboard';
import MyProfile from "./components/core/Dashboard/MyProfile";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart/Cart";
import AddCourse from "./components/core/Dashboard/AddCourse/AddCourse";
import MyCourse from "./components/core/Dashboard/MyCourse";
import EditCourse from "./components/core/Dashboard/EditCourse/EditCourse";
import Settings from "./components/core/Dashboard/Settings/Settings";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import Error from "./pages/Error";
import PrivateRoute from "./components/core/Auth/PrivateRoute";

import { filterData, apiURL } from './data';
import { ACCOUNT_TYPE } from "./utils/constants";
import { useSelector, useDispatch } from 'react-redux';
import { getUserCartFromDB } from './services/operations/cartAPI';
import { getUserDetails } from './services/operations/profileAPI';
import { setUser } from './redux/slices/profileSlice';
import VideoDetailsSidebar from "./components/core/ViewCourse/VideoDetailsSidebar"
import ViewCourse from './pages/ViewCourse';
import VideoDetails from "./components/core/ViewCourse/VideoDetails"
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor"

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [courses, setCourses] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState(filterData[0].title);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(apiURL);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: Server returned status ${response.status}`);
            }
            const output = await response.json();
            if (!output || typeof output !== 'object' || !output.data) {
                throw new Error("Invalid or empty response format received from server");
            }
            setCourses(output.data);
        } catch (err) {
            console.error("API Error:", err);
            setError(err.message || "Failed to load courses");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        if (token) {
            dispatch(getUserCartFromDB(token));
        }
    }, [fetchData, token, dispatch]);

    useEffect(() => {
        if (!token) return;
        let cancelled = false;
        const cachedUser = localStorage.getItem("user");
        getUserDetails(token).then((savedUser) => {
            // Do not overwrite a profile edited while this request was in flight.
            if (!cancelled && savedUser && localStorage.getItem("user") === cachedUser) {
                dispatch(setUser(savedUser));
                localStorage.setItem("user", JSON.stringify(savedUser));
            }
        });
        return () => { cancelled = true; };
    }, [token, dispatch]);

    return (
        <div className="w-full min-h-screen bg-richblack-900 flex flex-col font-inter">
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

            <div className="flex-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalog/:catalogueName" element={<Catalog />} />
                    <Route path="/course/:courseId" element={<CourseDetails />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* Open Routes for Unauthenticated Users */}
                    <Route
                        path="/signin"
                        element={
                            <OpenRoute>
                                <SignIn isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                            </OpenRoute>
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <OpenRoute>
                                <SignUp isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                            </OpenRoute>
                        }
                    />
                    <Route
                        path="/forgot-password"
                        element={
                            <OpenRoute>
                                <ForgotPassword />
                            </OpenRoute>
                        }
                    />
                    <Route
                        path="/update-password/:id"
                        element={
                            <OpenRoute>
                                <UpdatePassword />
                            </OpenRoute>
                        }
                    />
                    <Route
                        path="/verify-email"
                        element={
                            <OpenRoute>
                                <VerifyEmail />
                            </OpenRoute>
                        }
                    />

                    {/* Nested Dashboard with PrivateRoute */}
                    <Route
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    >
                        <Route path="/dashboard/my-profile" element={<MyProfile />} />
                        <Route path="/dashboard/settings" element={<Settings />} />

                        {/* Student Routes */}
                        {
                            user?.accountType === ACCOUNT_TYPE.STUDENT && (
                                <>
                                    <Route path="/dashboard/cart" element={<Cart />} />
                                    <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses />} />

                                </>
                            )
                        }


                        {/* Instructor Routes */}
                        {
                            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                                <>
                                    <Route path="/dashboard/instructor" element={<Instructor />} />
                                    <Route path="/dashboard/add-course" element={<AddCourse />} />
                                    <Route path="/dashboard/my-courses" element={<MyCourse />} />
                                    <Route path="/dashboard/edit-course/:courseId" element={<EditCourse />} />
                                </>
                            )
                        }
                        
                    </Route>

                    <Route element={
                        <PrivateRoute>
                            <ViewCourse />
                        </PrivateRoute>
                    }>
                        <Route
                            path="view-course/:courseId"
                            element={<VideoDetails />}
                        />
                        <Route
                            path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                            element={<VideoDetails />}
                        />
                    </Route>

                    {/* 404 Route */}
                    <Route path="*" element={<Error />} />
                </Routes>

                

            </div>

                    
           
        </div>
    );
}

export default App;
