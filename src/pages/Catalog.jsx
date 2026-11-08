import React, { useEffect, useState } from "react";
import Footer from "../components/common/Footer"
import { useParams, Link } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/APIs";
import { getCatalogPageData } from "../services/operations/pagesAndComponent";
import { categorySlug } from "../utils/categorySlug";
import Spinner from "../components/Spinner";
import CourseSlider from "../components/core/Catalog/CourseSlider";

export default function Catalog() {
    const { catalogueName } = useParams();
    const [activeTab, setActiveTab] = useState("Most Popular");
    const [loading, setLoading] = useState(true);
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [error, setError] = useState("");
    const [loadedSlug, setLoadedSlug] = useState(null);
    const [categoryDesc, setCategoryDesc] = useState("");


    // Format category title from slug
    const formattedTitle = catalogueName
        ? catalogueName
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
        : "Catalog";

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setCatalogPageData(null);
        setCategoryDesc("");
        setError("");
        setActiveTab("Most Popular");
        async function loadCategory() {
            try {
                const response = await apiConnector("GET", categories.CATEGORIES_API);
                if (!response.data?.success) throw new Error("Could not load categories.");
                const category = response.data.data.find((item) => categorySlug(item.name) === catalogueName);
                if (!category) throw new Error("Category not found.");
                const result = await getCatalogPageData(category._id);
                if (!result?.success || !result.data) throw new Error("Could not load courses. Please try again.");
                if (!cancelled) {
                    setCatalogPageData(result.data);
                    setCategoryDesc(category.description || "");
                }
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) { setLoadedSlug(catalogueName); setLoading(false); }
            }
        }
        loadCategory();
        return () => { cancelled = true; };
    }, [catalogueName]);

    if (loading || loadedSlug !== catalogueName) {
        return (
            <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center bg-richblack-900">
                <Spinner />
            </div>
        );
    }

    const selectedCourses = catalogPageData?.selectedCategory?.courses || [];

    return (
        <div className="w-full bg-richblack-900 text-richblack-5 font-inter">
            {/* Hero Category Header */}
            <div className="bg-richblack-800 py-12 border-b border-richblack-700">
                <div className="w-11/12 max-w-315 mx-auto flex flex-col gap-y-3">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-x-2 text-xs text-richblack-300">
                        <Link to="/" className="hover:text-yellow-50">
                            Home
                        </Link>
                        <span>/</span>
                        <span>Catalog</span>
                        <span>/</span>
                        <span className="text-yellow-50">{formattedTitle}</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold text-richblack-5">
                        {catalogPageData?.selectedCategory?.name || formattedTitle}
                    </h1>
                    
                    <p className="text-sm text-richblack-300 max-w-200 leading-relaxed">
                        {categoryDesc ||
                            catalogPageData?.selectedCategory?.description ||
                            `${formattedTitle} is a premier programming discipline. Master fundamentals, advanced patterns, and production-ready applications with hands-on projects.`}
                    </p>
                </div>
            </div>

            {/* Main Catalog Body */}
            <div className="w-11/12 max-w-315 mx-auto py-12 flex flex-col gap-y-16">
                {/* Section 1: Courses to get you started */}
                <div className="flex flex-col gap-y-6">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-richblack-5">
                        Courses to get you started
                    </h2>

                    {/* Filter Pills */}
                    <div className="flex border-b border-richblack-700 gap-x-6 text-sm font-medium">
                        {["Most Popular", "New"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-2.5 transition-all duration-200 cursor-pointer ${activeTab === tab
                                    ? "border-b-2 border-yellow-50 text-yellow-50 font-semibold"
                                    : "text-richblack-400 hover:text-richblack-100"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Dynamic Courses Grid */}
                    {error ? <p role="alert">{error}</p> : selectedCourses.length ? <CourseSlider courses={selectedCourses} /> : <p className="text-richblack-300">No courses available in this category yet.</p>}
                </div>

            </div>

            <Footer />
        </div>
    );
}