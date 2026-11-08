import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI"
import { getInstructorData } from "../../../../services/operations/profileAPI"
import Spinner from "../../../Spinner"
import { Link } from "react-router-dom"
import InstructorChart from './InstructorChart'
import getRandomColors from "../../../../utils/getRandomColors"
import './Instructor.css'

const Instructor = () => {
    const [loading, setLoading] = useState(true);
    const [instructorData, setInstructorData] = useState([])
    const [courses, setCourses] = useState([]);
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)

    useEffect(() => {
        const getCourseDataWithStats = async () => {
            setLoading(true);
            const instructorApiData = await getInstructorData(token);
            const result = await fetchInstructorCourses(token);

            if (instructorApiData) {
                setInstructorData(instructorApiData)
            }
            if (result) {
                setCourses(result)
            }
            setLoading(false);
        }

        if (token) {
            getCourseDataWithStats();
        }
    }, [token])

    const totalAmount = instructorData?.reduce((acc, cur) => acc + (cur.totalAmountGenerated || 0), 0) || 0
    const totalStudents = instructorData?.reduce((acc, cur) => acc + (cur.totalStudentsEnrolled || 0), 0) || 0

    const stats = [
        { label: "Total Courses", value: courses.length, icon: "📚", color: "from-red-500 to-yellow-500" },
        { label: "Total Students", value: totalStudents, icon: "👨‍🎓", color: "from-emerald-500 to-teal-500" },
        { label: "Total Income", value: `Rs. ${totalAmount}`, icon: "💰", color: "from-yellow-500 to-orange-500" },
    ]

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-inter py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <header className="max-w-7xl mx-auto mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-100 mb-1">Hi {user?.firstName} 👋</h1>
                        <p className="text-slate-400 text-sm">Let's start something new</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/30">
                            {user?.firstName?.[0] || "S"}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto">
                {
                    loading ? (
                        <div className="flex flex-col items-center justify-center h-96">
                            <Spinner className="w-12 h-12 text-yellow-500 animate-spin" />
                            <p className="mt-4 text-slate-400">Loading your dashboard...</p>
                        </div>
                    ) : (
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                                {stats.map((stat) => (
                                    <div
                                        key={stat.label}
                                        onMouseEnter={(event) => {
                                            event.currentTarget.style.setProperty('--stat-hover-color', getRandomColors(1)[0]);
                                        }}
                                        className="instructor-stat-card bg-[#1e293b] rounded-2xl border border-slate-700 p-6 shadow-xl transition-all duration-300 motion-reduce:transition-none group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-12 h-12 bg-linear-to-br from-yellow-500 to-orange-500 rounded-bl-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className={stat.color}
                                                // className="text-sm font-medium uppercase tracking-wider mb-1"
                                                >{stat.label}</p>
                                                <p className="text-3xl font-bold text-slate-100">{stat.value}</p>
                                            </div>
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800 border border-slate-700 shadow-inner`}>
                                                <span className="text-lg">{stat.icon}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                {/* Chart Section */}
                                <div className="lg:col-span-2">
                                    <div className="bg-[#1e293b] rounded-2xl border border-slate-700 p-6 shadow-xl mb-6">
                                        <h3 className="text-lg font-semibold text-slate-100 mb-6">Visualize</h3>
                                        <InstructorChart courses={instructorData} />
                                    </div>

                                    {/* Your Courses */}
                                    <div className="bg-[#1e293b] rounded-2xl border border-slate-700 p-6 shadow-xl">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg font-semibold text-slate-100">Your Courses</h3>
                                            <Link to="/dashboard/my-courses" className="text-yellow-500 text-sm font-medium hover:text-yellow-400 transition-colors flex items-center gap-1">
                                                <span>View All</span>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                            </Link>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {
                                                courses.slice(0, 3).map((course) => (
                                                    <div
                                                        key={course._id}
                                                        className="group bg-slate-900/50 rounded-xl border border-slate-700 p-4 hover:border-yellow-500/50 hover:bg-slate-800/80 transition-all duration-300 overflow-hidden"
                                                    >
                                                        <div className="relative h-32 rounded-lg overflow-hidden mb-3 bg-slate-800">
                                                            <img
                                                                src={course.thumbnail}
                                                                alt={course.name + " Course thumbnail"}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                onError={(e) => {
                                                                    e.target.src = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80";
                                                                }}
                                                            />
                                                            <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur px-2 py-1 rounded text-xs text-slate-300 border border-slate-600">
                                                                {course.status || "Published"}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-slate-100 line-clamp-1 mb-1 group-hover:text-yellow-400 transition-colors">{course.name}</h4>
                                                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                                                <span>{course.studentEnrolled?.length || 0} students</span>
                                                                <span className="w-px h-3 bg-slate-600 mx-1" />
                                                                <span>Rs. {course.price}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Sidebar - Stats Summary */}
                                <div className="lg:col-span-1">
                                    <div className="bg-[#1e293b] rounded-2xl border border-slate-700 p-6 shadow-xl sticky top-6">
                                        <h3 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v1m0 0a2 2 0 012 2v2.886m0 0a2 2 0 012 2v2.886m0 0a2 2 0 012 2v1a2 2 0 012 2v1a2 2 0 012 2v1a2 2 0 012 2v1a2 2 0 012 2zm0-12a2 2 0 01-2-2v1a2 2 0 00-2 2v1m0-1V5a2 2 0 00-2-2H5a2 2 0 00-2 2v1a2 2 0 002 2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-2 4h2a2 2 0 012 2v1a2 2 0 01-2 2h-2a2 2 0 01-2-2zm0 0v1a2 2 0 002 2v1a2 2 0 00-2 2v-1z" /></svg>
                                            Statistics
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                        📚
                                                    </div>
                                                    <span className="text-slate-400 text-sm">Total Courses</span>
                                                </div>
                                                <span className="text-lg font-bold text-slate-100">{courses.length}</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                                        👨‍🎓
                                                    </div>
                                                    <span className="text-slate-400 text-sm">Total Students</span>
                                                </div>
                                                <span className="text-lg font-bold text-slate-100">{totalStudents}</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                                                        💰
                                                    </div>
                                                    <span className="text-slate-400 text-sm">Total Income</span>
                                                </div>
                                                <span className="text-lg font-bold text-slate-100">Rs. {totalAmount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
            </main>
        </div>
    )
}

export default Instructor
