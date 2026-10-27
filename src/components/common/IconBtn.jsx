import React from 'react'

const IconBtn = ({
    text,
    onClick,
    children,
    disabled = false,
    outline = false,
    customClasses = "",
    type = "button"
}) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            type={type}
            className={`flex items-center justify-center gap-x-2 rounded-md py-2 px-5 font-semibold transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 text-sm md:text-base ${
                outline
                    ? "border border-yellow-50 bg-transparent text-yellow-50 hover:bg-yellow-50 hover:text-richblack-900"
                    : "bg-yellow-50 text-richblack-900 hover:bg-yellow-100 hover:shadow-none shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]"
            } ${customClasses}`}
        >
            {children ? (
                <>
                    <span>{text}</span>
                    {children}
                </>
            ) : (
                text
            )}
        </button>
    )
}

export default IconBtn
