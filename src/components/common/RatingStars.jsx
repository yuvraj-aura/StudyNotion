import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

const RatingStars = ({ rating }) => {
    // 1. Calculate full, half, and empty stars based on the rating prop
    const fullStars = Math.floor(rating || 0)
    const hasHalfStar = (rating || 0) % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
        <div className="flex items-center gap-1 text-yellow-400 text-xs">
            {/* Render Full Stars */}
            {[...Array(fullStars)].map((_, i) => (
                <FaStar key={`full-${i}`} />
            ))}

            {/* Render Half Star (if applicable) */}
            {hasHalfStar && <FaStarHalfAlt key="half-star" />}

            {/* Render Empty Stars */}
            {[...Array(emptyStars)].map((_, i) => (
                <FaRegStar key={`empty-${i}`} />
            ))}
        </div>
    )
}

export default RatingStars