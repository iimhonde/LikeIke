import React, { useState } from 'react';
import Header from './Components/PopupMenu/Header/Header';
import GenerateInputs from './Components/PopupMenu/SubdomainToken/SubdomainAndToken';
import GenerateAssignmentsButton from './Components/PopupMenu/Assignment_Button/Assignment_Button'; 
import CanvasApi from './CanvasApi';
import { useCanvasApi } from './CanvasApiContext';
import { useNavigate } from 'react-router-dom';
import './Components/PopupMenu/Frame/Frame.css'; 

const PopupMenu = () => {
    const [token, setToken] = useState('');
    const [subdomain, setSubdomain] = useState('');
    const [, setAssignments] = useState([]);
const [, setCourses] = useState([]);

    const { canvasApiInstance, setCanvasApiInstance } = useCanvasApi();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!token || !subdomain) {
            console.error("Canvas API Token and Subdomain are required.");
            return;
        }

        let canvasApi = canvasApiInstance;

        if (!canvasApiInstance) {
            canvasApi = new CanvasApi(token, subdomain);
            setCanvasApiInstance(canvasApi);
        }

        try {
            const assignmentsWithFlags = await canvasApi.defaultFlags();
            setAssignments(assignmentsWithFlags);

            const uniqueCourses = [...new Set(assignmentsWithFlags.map(assignment => assignment.course_name))];
            setCourses(uniqueCourses);
        } catch (error) {
            console.error(`Error in ${handleSubmit.name}:`, error.stack);
        }
    };

    const goToOptionsPage1 = () => {
        navigate('/options1');
    };

    return (
        <div className="frame">
            <Header />

            <div className="input-section">
                <GenerateInputs setToken={setToken} setSubdomain={setSubdomain} />
            </div>

            {/* Pass both handleSubmit and goToOptionsPage1 as props */}
            <GenerateAssignmentsButton handleSubmit={handleSubmit} navigateToPage={goToOptionsPage1} />
        </div>
    );
};

export default PopupMenu;
