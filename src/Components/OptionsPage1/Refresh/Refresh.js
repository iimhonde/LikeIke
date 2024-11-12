// Refresh.js
import React from 'react';
import './Refresh.css';
import refreshIcon from './Refresh.png';

const Refresh = ({ onClick }) => (
    <div>
        <img
            src={refreshIcon}
            alt="Reset Selection"
            className="reset-icon"
            onClick={onClick}
        />
    </div>
);

export default Refresh;
