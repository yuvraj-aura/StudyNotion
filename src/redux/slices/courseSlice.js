import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    courses: [],
    currentCourse: null,
    instructorCourses: [],
    loading: false,
    error: null,
};

const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        setCourses: (state, action) => {
            state.courses = action.payload;
            state.loading = false;
            state.error = null;
        },
        setCurrentCourse: (state, action) => {
            state.currentCourse = action.payload;
            state.loading = false;
            state.error = null;
        },
        setInstructorCourses: (state, action) => {
            state.instructorCourses = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        addCourse: (state, action) => {
            state.courses.unshift(action.payload);
            state.instructorCourses.unshift(action.payload);
            state.loading = false;
            state.error = null;
        },
        updateCourse: (state, action) => {
            const { id, ...updatedData } = action.payload;

            state.courses = state.courses.map((course) =>
                course._id === id ? { ...course, ...updatedData } : course
            );

            state.instructorCourses = state.instructorCourses.map((course) =>
                course._id === id ? { ...course, ...updatedData } : course
            );

            if (state.currentCourse && state.currentCourse._id === id) {
                state.currentCourse = { ...state.currentCourse, ...updatedData };
            }

            state.loading = false;
            state.error = null;
        },
        deleteCourse: (state, action) => {
            const courseId = action.payload;

            state.courses = state.courses.filter((course) => course._id !== courseId);
            state.instructorCourses = state.instructorCourses.filter(
                (course) => course._id !== courseId
            );

            if (state.currentCourse && state.currentCourse._id === courseId) {
                state.currentCourse = null;
            }

            state.loading = false;
            state.error = null;
        },
        resetCourse: (state) => {
            state.courses = [];
            state.currentCourse = null;
            state.instructorCourses = [];
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    setCourses,
    setCurrentCourse,
    setInstructorCourses,
    setLoading,
    setError,
    addCourse,
    updateCourse,
    deleteCourse,
    resetCourse,
} = courseSlice.actions;

export default courseSlice.reducer;
