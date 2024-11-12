import React from 'react';
import './Header.css'; // Import the CSS for the header
import logoImage from '../Logo/Logo.jpg';

const Header = () => {
    return (
        <div className="box">
            <h1 className="boxText">LIKE IKE</h1>
            <img src={logoImage} alt="Logo Icon" className="img" />
        </div>
    );
}

export default Header;
