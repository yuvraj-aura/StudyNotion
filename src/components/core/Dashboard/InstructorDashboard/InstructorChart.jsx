import { useMemo, useState } from 'react'
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"
import getRandomColors from "../../../../utils/getRandomColors"

Chart.register(...registerables);

const InstructorChart = ({ courses = [] }) => {
    const [curChart, setCurChart] = useState("students");
    const isStudents = curChart === "students";
    const entries = useMemo(() => {
        const colors = getRandomColors(courses.length);
        const metric = curChart === "students" ? "totalStudentsEnrolled" : "totalAmountGenerated";
        return courses.map((course, index) => ({
            label: course.courseName || course.name || "Untitled course",
            value: Number(course[metric]),
            color: colors[index],
        })).filter((entry) => Number.isFinite(entry.value) && entry.value > 0);
    }, [courses, curChart]);
    const hasData = entries.length > 0;
    const chartData = {
        labels: entries.map((entry) => entry.label),
        datasets: [{
            data: entries.map((entry) => entry.value),
            backgroundColor: entries.map((entry) => entry.color),
            borderWidth: 0,
            hoverOffset: 4,
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "#cbd5e1",
                    font: { size: 12, family: "Inter" },
                    padding: 20,
                },
            },
            tooltip: {
                enabled: true,
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                titleColor: "#ffffff",
                bodyColor: "#94a3b8",
                titleFont: { size: 13, weight: "bold", family: "Inter" },
                bodyFont: { size: 12, family: "Inter" },
                padding: 10,
                cornerRadius: 8,
                displayColors: false,
            },
        },
    };

    const title = isStudents ? "Student Enrollment" : "Course Income";

    return (
        <div className="w-full animate-fade-in">
            <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
                {/* Glow accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500" />

                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-100 tracking-tight">{title}</h3>
                    <div className="flex gap-2 bg-slate-900/50 rounded-lg border border-slate-700 p-1">
                        <button
                            type="button"
                            aria-pressed={isStudents}
                            onClick={() => setCurChart("students")}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
                                curChart === "students"
                                    ? "bg-gradient-to-br from-yellow-500 to-orange-500 text-slate-900 shadow-lg"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                            }`}
                        >
                            Students
                        </button>
                        <button
                            type="button"
                            aria-pressed={!isStudents}
                            onClick={() => setCurChart("income")}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
                                curChart === "income"
                                    ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                            }`}
                        >
                            Income
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-center h-64 relative">
                    {hasData ? <Pie
                        key={curChart}
                        data={chartData}
                        options={options}
                    /> : (
                        <div role="status" className="max-w-sm text-center px-4">
                            <p className="text-lg font-semibold text-slate-100 mb-3">
                                {isStudents ? "Your first student is the start of something great" : "Your knowledge can open new doors"}
                            </p>
                            <p className="text-sm leading-relaxed text-slate-400">
                                {isStudents
                                    ? "No enrollments yet. Keep sharing your courses — your next learner could be just around the corner."
                                    : "No earnings yet. Keep creating helpful lessons and sharing your expertise. Every learning journey starts with one course."}
                            </p>
                        </div>
                    )}
                </div>

                {/* Legend hint */}
                {hasData && <div className="mt-4 flex items-center gap-2 text-slate-500 text-xs">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span>{entries.length} {entries.length === 1 ? "course" : "courses"} &middot; Hover for details</span>
                </div>}
            </div>
        </div>
    )
}

export default InstructorChart
