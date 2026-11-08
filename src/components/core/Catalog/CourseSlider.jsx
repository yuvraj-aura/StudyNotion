import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import 'swiper/css/autoplay'
import 'swiper/css/navigation'
import { Autoplay, FreeMode, Pagination, Navigation } from "swiper/modules"
import Course_Card from "./Course_Card";

const CourseSlider = ({ courses, Height }) => {
    if (!courses?.length) {
        return (
            <p className="text-richblack-300 text-center py-8">
                No courses available in this category.
            </p>
        );
    }

    return (
        <div className="w-full">
            <Swiper
                slidesPerView={4}
                spaceBetween={24}
                loop={true}
                modules={[FreeMode, Pagination, Navigation]}
                breakpoints={{
                    1536: { slidesPerView: 4, spaceBetween: 24 },
                    1280: { slidesPerView: 3, spaceBetween: 20 },
                    1024: { slidesPerView: 3, spaceBetween: 20 },
                    768: { slidesPerView: 2, spaceBetween: 16 },
                    640: { slidesPerView: 1, spaceBetween: 16 },
                }}
                navigation={true}
                pagination={{ clickable: true }}
                className="w-full pb-12 pt-2"
            >
                {courses.map((course, i) => (
                    <SwiperSlide key={i} className="h-auto">
                        <Course_Card course={course} Height={Height} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default CourseSlider;