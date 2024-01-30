// FloatingButton.js
import React from 'react';
import './FloatingBtn.css'; // Import your styling

const FloatingButton = ({onClick}) => {

  return (
    <div className="floatingButton" >
        <button className="add-button" onClick={onClick}>
          <svg className="add-svgIcon" stroke="currentColor"
            fill="currentColor" strokeWidth="0"
            t="1551322312294"
            viewBox="0 0 1024 1024" version="1.1"
             height="1.5em" width="1.5em"
            xmlns="http://www.w3.org/2000/svg"><defs></defs><path
              d="M474 152m8 0l60 0q8 0 8 8l0 704q0 8-8 8l-60 0q-8 0-8-8l0-704q0-8 8-8Z"></path><path
                d="M168 474m8 0l672 0q8 0 8 8l0 60q0 8-8 8l-672 0q-8 0-8-8l0-60q0-8 8-8Z"></path>
          </svg>
        </button>
    </div>
  );
};

export default FloatingButton;
