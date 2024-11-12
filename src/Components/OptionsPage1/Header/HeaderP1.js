import React from 'react';
import './HeaderP1.css';
import logoImage from '../../PopupMenu/Logo/Logo.jpg';
import ExportButton from '../Export Button/ExportButton';

const HeaderP1 = ({ title = "Assignments", fontSize = "51px", showExportButton = true, handleDeleteAssignments, navigateToPage }) => {
    return (
        <div className="header">
            <div className="headerlogo-container">
                <h1 className="header-title" style={{ fontSize }}>{title}</h1>
                <img src={logoImage} alt="Logo Icon" className="logo" />
            </div>
            {showExportButton && (
                <ExportButton handleDeleteAssignments={handleDeleteAssignments} navigateToPage={navigateToPage} />
            )}
        </div>
    );
};

export default HeaderP1;
