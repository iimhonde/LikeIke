import React from 'react';
import './Assignment_Button.css';

const GenerateAssignmentsButton = ({ handleSubmit, navigateToPage }) => {
    const handleClick = async (event) => {
        await handleSubmit(event); // Generate assignments
        navigateToPage(); // Navigate to OptionsPage1
    };

    return (
        <button onClick={handleClick} className="generate-assignments-frame">
            Generate Assignments
        </button>
    );
};

export default GenerateAssignmentsButton;
