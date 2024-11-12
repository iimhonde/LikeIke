import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import CleanAsgmt from './CleanAsgmt';
import Table from './Components/OptionsPage1/Table/Table';
import { useCanvasApi } from './CanvasApiContext';
import './Components/OptionsPage1/OptionsPage1.css';
import HeaderP1 from './Components/OptionsPage1/Header/HeaderP1';
import Refresh from './Components/OptionsPage1/Refresh/Refresh';
import Help from './Components/OptionsPage1/Help/Help';


const OptionsPage1 = () => {
    const { canvasApiInstance } = useCanvasApi();
    const cleanAsgmt = new CleanAsgmt(canvasApiInstance);
    const navigate = useNavigate();

    const [assignments, setAssignments] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [selectedAssignments, setSelectedAssignments] = useState([]);
    const [courses, setCourses] = useState([]);
    

    useEffect(() => {
        const loadAssignments = async () => {
            const data = await canvasApiInstance.defaultFlags();
            setAssignments(data);

            const uniqueCourses = [...new Set(data.map(assignment => assignment.course_name))];
            setCourses(uniqueCourses);
        };

        loadAssignments();
    }, [canvasApiInstance]);

    const toggleCourseSelection = (courseName) => {
        const courseId = assignments.find(assignment => assignment.course_name === courseName)?.course_id;

        if (!courseId) return;

        const updatedSelectedCourses = selectedCourses.includes(courseId)
            ? selectedCourses.filter(id => id !== courseId)
            : [...selectedCourses, courseId];

        setSelectedCourses(updatedSelectedCourses);
    };

    const toggleAssignmentSelection = (assignmentId) => {
        setSelectedAssignments((prevSelected) =>
            prevSelected.includes(assignmentId)
                ? prevSelected.filter((id) => id !== assignmentId) // Remove if already selected
                : [...prevSelected, assignmentId] // Add if not already selected
        );
    };

    const handleDeleteAssignments = async () => {
        const assignmentsToDelete = assignments.filter(assignment =>
            selectedAssignments.includes(assignment.id) ||
            selectedCourses.includes(assignment.course_id)
        ).map(assignment => assignment.id);

        const updatedAssignments = await cleanAsgmt.deleteAssignments(assignmentsToDelete);
        setAssignments(updatedAssignments);

        setSelectedCourses([]);
        setSelectedAssignments([]);

        return updatedAssignments;
    };

    const handleReset = async () => {
        // Reload the assignments and clear selections
        const allAssignments = await canvasApiInstance.defaultFlags();
        setAssignments(allAssignments);
        setSelectedCourses([]);
        setSelectedAssignments([]);
    };

    const navigateToPage = () => {
        navigate('/options2', { state: { updatedAssignments: assignments } });
    };



    return (
        <div>
            <HeaderP1 handleDeleteAssignments={handleDeleteAssignments} navigateToPage={navigateToPage} />
         
            <div className="course-buttons-container">
                {courses.map((courseName, index) => {
                    const courseId = assignments.find(assignment => assignment.course_name === courseName)?.course_id;

                    return (
                        <button
                            key={index}
                            className={`course-button ${selectedCourses.includes(courseId) ? 'selected' : ''}`}
                            onClick={() => toggleCourseSelection(courseName)}
                        >
                            {courseName}
                        </button>
                    );
                })}
                 <div className="help-refresh-container">
                    <Help />
                    <Refresh onClick={handleReset} />
                </div>
                
            </div>
           

            <Table
                assignments={assignments}
                selectedAssignments={selectedAssignments}
                toggleAssignmentSelection={toggleAssignmentSelection}
            />

            <button onClick={handleDeleteAssignments}>Delete Selected Assignments or Courses</button>
           
        </div>
    );
};

export default OptionsPage1;
