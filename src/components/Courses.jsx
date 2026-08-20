import React from 'react';
import Course from './Course';
import "./Courses.css";

const Courses = ({ courses, category }) => {   
    function getCourses() {
        if (!courses || typeof courses !== 'object') {
            return [];
        }

        if (category === "All") {
            let allCourses = [];
            Object.values(courses).forEach(courseCategory => {
                if (Array.isArray(courseCategory)) {
                    courseCategory.forEach(course => {
                        if (course && course.id) {
                            allCourses.push(course);
                        }
                    });
                }
            });
            return allCourses;
        } else {
            const categoryCourses = courses[category];
            if (Array.isArray(categoryCourses)) {
                return categoryCourses.filter(course => course && course.id);
            }
            return [];
        }
    }

    const courseList = getCourses();

    // Edge Case: Empty list of courses
    if (!courseList || courseList.length === 0) {
        return (
            <div className='status-message-container empty-state'>
                <div className='status-icon'>🔍</div>
                <h3 className='status-title'>No Courses Found</h3>
                <p className='status-desc'>
                    {category === "All" 
                        ? "There are currently no courses available." 
                        : `No courses are currently available in the "${category}" category.`}
                </p>
            </div>
        );
    }

    return (
        <div className='course-container'>
            {
                courseList.map((course) => (
                    <Course
                        key={course.id}
                        course={course}
                    />
                ))
            }
        </div>
    );
};

export default Courses;