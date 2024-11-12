import React, { useState } from 'react';
import './Table.css';

// Format the date for display
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

// TableHeaders Component for Consistent Column Headers
export function TableHeaders({ headers }) {
    return (
        <tr>
            {headers.map((header, index) => (
                <th key={index}>{header}</th>
            ))}
        </tr>
    );
}

// TableRow Component for Individual Assignment Rows with selection checkbox
export function TableRow({ assignment, formatDate, selectedAssignments, toggleAssignmentSelection }) {
    return (
        <tr key={assignment.id}>
            <td>
                <input
                    type="checkbox"
                    checked={selectedAssignments.includes(assignment.id)}
                    onChange={() => toggleAssignmentSelection(assignment.id)}
                />
            </td>
            <td>{assignment.name}</td>
            <td>{assignment.due_at ? formatDate(assignment.due_at) : "N/A"}</td>
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
    );
}

// Main Table Component
const Table = ({ assignments, selectedAssignments, toggleAssignmentSelection }) => {
    return (
        <div>
            <table className="assignments-table">
                <thead>
                    <TableHeaders headers={["Select", "Assignment Name", "Due Date", "Submission Link"]} />
                </thead>
                <tbody>
                    {assignments.map((assignment) => (
                        <TableRow
                            key={assignment.id}
                            assignment={assignment}
                            formatDate={formatDate}
                            selectedAssignments={selectedAssignments}
                            toggleAssignmentSelection={toggleAssignmentSelection}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
