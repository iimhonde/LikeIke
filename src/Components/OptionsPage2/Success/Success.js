import React from 'react';
import './Success.css'; 



const Success = ({ matrixUrl }) => {
    return (
        <div className="success-message">
            <span className="success-text">Success!</span> 
            <span> Click </span>
            <a 
                href={matrixUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="success-link"
            >
                here
            </a> 
            <span> to navigate to your matrix</span>
        </div>
    );
};

export default Success;







