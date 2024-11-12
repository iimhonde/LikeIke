import React, { useState } from 'react';
import './Help.css';
import iconImage from '../../PopupMenu/Icon/Icon.jpg';

const Tooltip = ({ text, visible }) => (
    visible ? (
        <div className="tooltip">
            <div className="help-text">{text}</div>
        </div>
    ) : null
);

const Help = () => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div>
            <img
                src={iconImage}
                alt="Icon"
                className="tooltip-icon"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            />
            <Tooltip
                text={
                    <>
                        <span>1. Toggle the course buttons to select class assignments to remove from export.</span><br />
                        <span style={{ paddingLeft: '1em' }}>- The green color indicates that the course has been selected.</span><br />
                        <span>2. Select individual assignments to remove by toggling the checkbox.</span><br />
                        <span>3. Upon selecting assignments/courses, click on the "Delete Selected Assignments or Courses" button to finalize and remove the assignments.</span><br />
                        <span>4. Click the refresh icon if you wish to clear your selections and return to the default view.</span><br />
                    </>
                }
                visible={showTooltip}
            />
        </div>
    );
};

export default Help;
