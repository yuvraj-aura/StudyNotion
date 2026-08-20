import React, { useState } from 'react';
import "./Course.css";
import { FcLike } from 'react-icons/fc';
import { FcLikePlaceholder } from "react-icons/fc";
import { toast } from 'react-toastify';

const Course = ({ course }) => {
    const [readMore, setReadMore] = useState(false);
    const [isLike, setIsLike] = useState(false);

    let handlereadMore = () => {
        setReadMore(!readMore);
    };

    let handleLike = () => {
        setIsLike(!isLike);
        if (!isLike) {
            toast.success("Liked Successfully");
        } else {
            toast.error("DisLiked Successfully");
        }
    };

    const imageUrl = course?.image?.url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80";
    const imageAlt = course?.image?.alt || course?.title || "Course Image";
    const title = course?.title || "Untitled Course";
    const description = course?.description || "No description provided for this course.";

    return (
        <div className='course'>
            <div className='img-container'>
                <img 
                    src={imageUrl} 
                    alt={imageAlt} 
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80";
                    }}
                />
                <div className='like-icon'>
                    <button onClick={handleLike} aria-label={isLike ? "Unlike course" : "Like course"}>
                        {
                            (!isLike) ? (<FcLikePlaceholder fontSize="1.75rem" />) : (<FcLike fontSize="1.75rem" />)
                        }
                    </button>
                </div> 
            </div>
            <div>
                <h3 className='title'>{title}</h3>
                <p>
                    {
                        description.length > 100 
                            ? (description.substr(0, 100) + "...") 
                            : description
                    }
                </p>
            </div>
        </div>
    );
};

export default Course;