import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/APIs";
import { getCatalogPageData } from "../services/operations/pagesAndComponent";
import { getAllCourses } from "../services/operations/courseDetailsAPI";
import Spinner from "../components/Spinner";

export default function Catalog() {
  const { catalogueName } = useParams();
  const [activeTab, setActiveTab] = useState("Most Popular");
  const [loading, setLoading] = useState(true);
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [categoryDesc, setCategoryDesc] = useState("");
  const [allFallbackCourses, setAllFallbackCourses] = useState([]);

  // Format category title from slug
  const formattedTitle = catalogueName
    ? catalogueName
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Catalog";

  // Step 1: Find categoryId matching current catalogueName slug from DB categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        const categoryList = res?.data?.data || [];

        // Match category by slug or name
        const currentCategory = categoryList.find(
          (ct) =>
            ct.name.toLowerCase().split(" ").join("-") === catalogueName?.toLowerCase() ||
            ct.name.toLowerCase() === catalogueName?.toLowerCase()
        );

        if (currentCategory) {
          setCategoryId(currentCategory._id);
          setCategoryDesc(currentCategory.description || "");
        } else if (categoryList.length > 0) {
          // Fallback to first available category if slug doesn't match directly
          setCategoryId(categoryList[0]._id);
          setCategoryDesc(categoryList[0].description || "");
        }
      } catch (error) {
        console.log("Could not fetch categories:", error);
      }
    };
    getCategories();
  }, [catalogueName]);

  // Step 2: Fetch courses for this category from database
  useEffect(() => {
    const getCategoryDetails = async () => {
      setLoading(true);
      try {
        if (categoryId) {
          const res = await getCatalogPageData(categoryId);
          if (res?.success && res?.data) {
            setCatalogPageData(res.data);
          }
        }
        // Also fetch all courses as fallback if specific category has no courses yet
        const all = await getAllCourses();
        setAllFallbackCourses(all);
      } catch (error) {
        console.log("Error fetching catalog details:", error);
      } finally {
        setLoading(false);
      }
    };

    getCategoryDetails();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center bg-richblack-900">
        <Spinner />
      </div>
    );
  }

  // Selected category courses from DB, with fallback to all courses
  const selectedCourses =
    catalogPageData?.selectedCategory?.courses?.length > 0
      ? catalogPageData.selectedCategory.courses
      : allFallbackCourses;

  const differentCourses =
    catalogPageData?.differentCourses?.length > 0
      ? catalogPageData.differentCourses
      : allFallbackCourses.slice(0, 3);

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
                className={`pb-2.5 transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? "border-b-2 border-yellow-50 text-yellow-50 font-semibold"
                    : "text-richblack-400 hover:text-richblack-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Dynamic Courses Grid */}
          {selectedCourses?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
              {selectedCourses.map((course) => {
                const instructorName = course?.instructor
                  ? `${course.instructor.firstName || ""} ${course.instructor.lastName || ""}`.trim()
                  : "Instructor";

                const ratingCount = course?.ratingAndReviews?.length || 0;
                const priceValue = course?.price || 0;
                const thumbnailSrc =
                  course?.thumbnail ||
                  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80";

                return (
                  <Link
                    to={`/course/${course._id}`}
                    key={course._id}
                    className="group flex flex-col"
                  >
                    <div className="relative overflow-hidden rounded-xl border border-richblack-700 bg-richblack-800 shadow-lg group-hover:scale-[1.02] transition-transform duration-200">
                      <img
                        src={thumbnailSrc}
                        alt={course.name}
                        className="h-50 w-full object-cover"
                        loading="lazy"
                      />
                      <div className="p-5 flex flex-col gap-y-2">
                        <h3 className="font-semibold text-base text-richblack-5 group-hover:text-yellow-50 transition-colors line-clamp-1">
                          {course.name}
                        </h3>
                        <p className="text-xs text-richblack-400">By {instructorName}</p>

                        <div className="flex items-center gap-x-2 text-xs">
                          <span className="font-semibold text-yellow-50">4.8</span>
                          <div className="flex text-yellow-50 text-xs">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className="text-yellow-50" />
                            ))}
                          </div>
                          <span className="text-richblack-400">({ratingCount})</span>
                        </div>

                        <p className="text-base font-bold text-richblack-5 mt-1">
                          ₹ {priceValue}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-richblack-300">
              <p className="text-lg font-medium">No courses found in this category yet.</p>
              <p className="text-sm text-richblack-400 mt-1">
                Instructors are currently preparing new courses for this track!
              </p>
            </div>
          )}
        </div>

        {/* Section 2: Recommended / Other Courses */}
        {differentCourses?.length > 0 && (
          <div className="flex flex-col gap-y-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-richblack-5">
              Frequently Bought Together & Other Top Courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {differentCourses.map((course) => {
                const instructorName = course?.instructor
                  ? `${course.instructor.firstName || ""} ${course.instructor.lastName || ""}`.trim()
                  : "Instructor";

                const thumbnailSrc =
                  course?.thumbnail ||
                  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80";

                return (
                  <Link
                    to={`/course/${course._id}`}
                    key={course._id}
                    className="group flex flex-col"
                  >
                    <div className="relative overflow-hidden rounded-xl border border-richblack-700 bg-richblack-800 shadow-lg group-hover:scale-[1.02] transition-transform duration-200">
                      <img
                        src={thumbnailSrc}
                        alt={course.name}
                        className="h-50 w-full object-cover"
                        loading="lazy"
                      />
                      <div className="p-5 flex flex-col gap-y-2">
                        <h3 className="font-semibold text-base text-richblack-5 group-hover:text-yellow-50 transition-colors line-clamp-1">
                          {course.name}
                        </h3>
                        <p className="text-xs text-richblack-400">By {instructorName}</p>
                        <p className="text-base font-bold text-richblack-5 mt-1">
                          ₹ {course.price || 0}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
