import { useEffect, useState, useCallback } from 'react';
import './App.css';
import Navbar from "./components/common/Navbar";
import Dashboard from "./components/Dashboard";
import { Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Footer from "./components/common/Footer";
import PrivateRoute from "./components/PrivateRoute";
import { filterData, apiURL } from './data';
import { toast } from 'react-toastify';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
        toast.error("Unable to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    }, []);
  
    useEffect(() => {
      fetchData();
    }, [fetchData]);

  return (
    <>
      <div className="w-full min-h-screen bg-richblack-900 flex flex-col font-inter">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signin" element={<SignIn isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<SignUp isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/dashboard" element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Dashboard courses={courses} category={category} setCategory={setCategory} loading={loading} error={error}/>
              </PrivateRoute>
            } />
            
          </Routes>
        </div>

        <Footer />
      </div>
    </>
  )
}

export default App


