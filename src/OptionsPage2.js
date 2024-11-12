import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import NotionApi from './NotionApi';
import Table2 from './Components/OptionsPage2/Table2/Table2';
import HeaderP1 from './Components/OptionsPage1/Header/HeaderP1';
import Navigation from './Components/OptionsPage2/Navigation/Navigation';
import Success from './Components/OptionsPage2/Success/Success';

const OptionsPage2 = () => {
    const location = useLocation();
    const { updatedAssignments } = location.state || {};
    const [selectedAssignments, setSelectedAssignments] = useState([]);
    const [matrixUrl, setMatrixUrl] = useState(null); // State to store matrix URL
    const workerURL = 'https://misty-cell-3562.iimhonde.workers.dev/';

    const token = process.env.REACT_APP_NOTION_API_TOKEN;
    const databaseId = process.env.REACT_APP_DATABASE_ID;
    const notionApi = useRef(null);

    useEffect(() => {
        if (token && databaseId) {
            notionApi.current = new NotionApi(token, databaseId, workerURL);
        } else {
            console.error('Credentials not available');
        }
    }, [token, databaseId, workerURL]);

    const availableColors = ["blue", "green", "red", "purple", "orange", "yellow", "gray", "brown", "pink"];
    const courseColorMap = {};

    const transformPriority = (assignments) => {
        let colorIndex = 0;

        return assignments.map(assignment => {
            let urgent = 0;
            let important = 0;

            switch (assignment.priority) {
                case 1: urgent = 0; important = 0; break;
                case 2: urgent = 0; important = 1; break;
                case 3: urgent = 1; important = 0; break;
                case 4: urgent = 1; important = 1; break;
                default: break;
            }

            const courseName = assignment.course_name;
            if (!courseColorMap[courseName]) {
                courseColorMap[courseName] = availableColors[colorIndex % availableColors.length];
                colorIndex++;
            }

            const courseColor = courseColorMap[courseName];
            return { ...assignment, urgent, important, course: courseName, courseColor };
        });
    };

    const transformedAssignments = transformPriority(updatedAssignments || []);
    const courseNames = transformedAssignments.map(assignment => assignment.course_name);
    const numCourses = courseNames.length;
    const truncatedColors = availableColors.slice(0, numCourses);

    const courseOptions = courseNames.map((courseName, index) => ({
        name: courseName,
        color: truncatedColors[index % truncatedColors.length]
    }));

    const toggleAssignmentSelection = (assignmentId) => {
        setSelectedAssignments(prevSelected =>
            prevSelected.includes(assignmentId)
                ? prevSelected.filter(id => id !== assignmentId)
                : [...prevSelected, assignmentId]
        );
    };

    const handleMatrixCreation = async (existingDayPageId) => {
        try {
          
            const matrixUrl = await notionApi.current.addAssignmentsToMatrix( transformedAssignments, existingDayPageId);
            setMatrixUrl(matrixUrl); // Save matrix URL to state
        } catch (error) {
            console.error("Error creating matrix:", error);
        }
    };

    const handleDateSelect = async ({ date, entryType, action }) => {
        console.log(`Selected Date: ${date}, Entry Type: ${entryType}, Action: ${action}`);
        const formattedDate = await notionApi.current.formatDate(date);

        switch (entryType) {
            case 'month':
                if (action === 'create') {
                    await notionApi.current.createMonthPage(date);
                } else {
                    await notionApi.current.findMonthByName(formattedDate);
                }
                break;
            case 'week':
                const existingWeekPageId = await notionApi.current.checkIfWithinExistingWeek(formattedDate);
               
                if (action === 'create') {
                    if (!existingWeekPageId) {
                        const newWeekPageId = await notionApi.current.createWeekPage(date);
                        if (newWeekPageId) console.log(`Created new week page: ${newWeekPageId}`);
                    } else {
                        console.log(`Using existing week with page ID: ${existingWeekPageId}`);
                    }
                } else {
                    if (existingWeekPageId) {
                        console.log(`Found existing week: ${existingWeekPageId}`);
                    } else {
                        console.error("No existing week covers this date.");
                    }
                }
                break;
            case 'day':
                if (action === 'create') {
                    const doIexist = await notionApi.current.searchNotion(formattedDate);
                    let newDayMatrixId = null;

                    if(doIexist === null){
                        newDayMatrixId = await notionApi.current.createDayMatrix(courseOptions, date);
                        } else {
                            console.log("This day matrix already exists, babes");
                        
                        }
                       

                    if (newDayMatrixId) {
                        await handleMatrixCreation(newDayMatrixId);
                    }
                } else {
                    const existingDayPageId = await notionApi.current.searchNotion(formattedDate);
                    if (existingDayPageId) {
                        await handleMatrixCreation(existingDayPageId);
                    } else {
                        console.error("Failed to find existing day matrix for the specified date.");
                    }
                }
                break;
            default:
                console.error('Unknown entry type');
        }
    };

    return (
        <div>
            <HeaderP1 title="Import Assignments to Notion" fontSize="50px" showExportButton={false} />
            <div className="content-container" style={{ display: 'flex', flexDirection: 'row' }}>
                <Table2
                    assignments={transformedAssignments}
                    selectedAssignments={selectedAssignments}
                    toggleAssignmentSelection={toggleAssignmentSelection}
                />
                <div className="navigation-container">
                    <Navigation onDateSelect={handleDateSelect} />
                    {matrixUrl && <Success matrixUrl={matrixUrl} />} 
                </div>
            </div>
            
        </div>
    );
};

export default OptionsPage2;
