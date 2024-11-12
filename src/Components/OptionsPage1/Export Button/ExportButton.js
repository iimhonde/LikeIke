import React from 'react';
import './ExportButton.css';

const ExportButton = ({ handleDeleteAssignments, navigateToPage }) => {
    const handleExport = async () => {
        
        const updatedAssignments = await handleDeleteAssignments();

        
        console.log("Exporting updated assignments to Notion:", updatedAssignments);

        navigateToPage();
    };

    return (
        <button onClick={handleExport} className="export-button">
            Export Assignments
        </button>
    );
};

export default ExportButton;
