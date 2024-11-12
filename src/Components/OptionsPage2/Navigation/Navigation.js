import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Navigation.css';

const Navigation = ({ onDateSelect }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [action, setAction] = useState('create');
    const [entryType, setEntryType] = useState('day'); 

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleEntryTypeChange = (type) => {
        setEntryType(type);
    };

    const handleActionChange = (actionType) => {
        setAction(actionType);

        if (actionType === 'existing') {
            setEntryType('day');
        }
    };

    const handleImport = () => {
        onDateSelect({ date: selectedDate, entryType, action });
    };

    return (
        <div className="import-form">
            <div className="action-selector">
                <button
                    className={`action-button ${action === 'create' ? 'active' : ''}`}
                    onClick={() => handleActionChange('create')}
                >
                    Create New
                </button>
                <button
                    className={`action-button ${action === 'existing' ? 'active' : ''}`}
                    onClick={() => handleActionChange('existing')}
                >
                    Add to Existing
                </button>
            </div>

            {action === 'create' && (
                <div className="entry-type-selector">
                    <button
                        className={`entry-button ${entryType === 'month' ? 'active' : ''}`}
                        onClick={() => handleEntryTypeChange('month')}
                    >
                        Month
                    </button>
                    <button
                        className={`entry-button ${entryType === 'week' ? 'active' : ''}`}
                        onClick={() => handleEntryTypeChange('week')}
                    >
                        Week
                    </button>
                </div>
            )}

           
            <div className="entry-type-selector">
                <button
                    className={`entry-button ${entryType === 'day' ? 'active' : ''}`}
                    onClick={() => handleEntryTypeChange('day')}
                >
                    Day
                </button>
            </div>

            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="MM/dd/yyyy"
                placeholderText="Select a date"
            />

            <button onClick={handleImport} className="import-button">
                Import
            </button>
        </div>
    );
};

export default Navigation;
