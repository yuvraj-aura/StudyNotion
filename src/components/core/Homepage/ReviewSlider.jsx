import { FaStar } from "react-icons/fa";

const reviews = [
  {
    name: "Cody Fisher",
    email: "cody.fisher@example.com",
    review:
      "Coordination of activities improved tremendously with Learn codings.",
    rating: 4.5,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Cody+Fisher",
  },
  {
    name: "Esther Howard",
    email: "esther.howard@example.com",
    review:
      "Everyone's on the same page. Many of our people are not very organized naturally, so Learn codings is a godsend!",
    rating: 4.5,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Esther+Howard",
  },
  {
    name: "Eleanor Pena",
    email: "eleanor.pena@example.com",
    review:
      "I would recommend Learn codings for anyone trying to get the word out about their business. It has saved me so much time!",
    rating: 4.5,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Eleanor+Pena",
  },
  {
    name: "Kristin Watson",
    email: "kristin.watson@example.com",
    review:
      "With Learn codings, we have finally accomplished things that have been waiting forever to get done.",
    rating: 4.5,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Kristin+Watson",
  },
];

const ReviewSlider = () => {
  return (
    <div className="w-full my-20">
      <div className="text-center font-semibold text-3xl sm:text-4xl text-richblack-5 mb-12">
        Reviews from other learners
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {reviews.map((rev, index) => (
          <div
            key={index}
            className="flex flex-col justify-between bg-richblack-800 p-5 rounded-lg border border-richblack-700/60 shadow-md hover:border-richblack-600 transition-all duration-200"
          >
            <div>
              {/* User Header */}
              <div className="flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="h-10 w-10 rounded-full object-cover border border-richblack-600"
                />
                <div className="flex flex-col">
                  <h4 className="font-semibold text-richblack-5 text-[15px]">
                    {rev.name}
                  </h4>
                  <p className="text-[12px] text-richblack-500">{rev.email}</p>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-richblack-100 text-[13px] leading-relaxed mt-4">
                {rev.review}
              </p>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-2 mt-5">
              <span className="text-yellow-100 font-semibold text-sm">
                {rev.rating.toFixed(1)}
              </span>
              <div className="flex text-yellow-100 text-xs gap-1">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar className="opacity-60" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSlider;
