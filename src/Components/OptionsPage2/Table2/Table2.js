import React, { useState } from 'react';
import { TableHeaders, formatDate } from '../../OptionsPage1/Table/Table';
import '../../OptionsPage1/Table/Table.css'

const Table2 = ({ assignments }) => {
    const [tableAssignments, setTableAssignments] = useState(assignments);

    const handleUrgencyChange = (id, value) => {
        setTableAssignments(prevAssignments =>
            prevAssignments.map(assignment =>
                assignment.id === id ? { ...assignment, urgent: parseInt(value, 10) } : assignment
            )
        );
        console.log(`Updated Urgent for ID ${id} to ${value}`);
    };

    const handleImportanceChange = (id, value) => {
        setTableAssignments(prevAssignments =>
            prevAssignments.map(assignment =>
                assignment.id === id ? { ...assignment, important: parseInt(value, 10) } : assignment
            )
        );
        console.log(`Updated Important for ID ${id} to ${value}`);
    };

    return (
        <table className="assignments-table">
            <thead>
                <TableHeaders headers={["Assignment Name", "Due Date", "Urgent", "Important", "Submission Link"]} />
            </thead>
            <tbody>
                {tableAssignments.map((assignment) => (
                    <tr key={assignment.id}>
                        <td>{assignment.name}</td>
                        <td>{assignment.due_at ? formatDate(assignment.due_at) : "N/A"}</td>
                        <td>
                            <select
                                value={assignment.urgent}
                                onChange={(e) => handleUrgencyChange(assignment.id, e.target.value)}
                            >
                                <option value="0">0</option>
                                <option value="1">1</option>
                            </select>
                        </td>
                        <td>
                            <select
                                value={assignment.important}
                                onChange={(e) => handleImportanceChange(assignment.id, e.target.value)}
                            >
                                <option value="0">0</option>
                                <option value="1">1</option>
                            </select>
                        </td>
                        <td>
                            {assignment.html_url ? (
                                <a href={assignment.html_url} target="_blank" rel="noopener noreferrer">
                                    Submission Link
                                </a>
                            ) : (
                                "N/A"
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table2;
