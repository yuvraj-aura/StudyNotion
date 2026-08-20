import React from 'react';
import "./FilterButton.css";

const FilterButton = ({ filterData, category, setCategory }) => {
    let handleCategory = (title) => {
        setCategory(title);
    }
    return (
        <div className='filter-btn'>
            {
                filterData.map((btn) => (
                    <button 
                        className={category === btn.title ? 'filter-tab active-tab' : 'filter-tab'}
                        onClick={() => handleCategory(btn.title)} 
                        key={btn.id}
                    >
                        {btn.title}
                    </button>
                ))
            }
        </div>
    )
}

export default FilterButton