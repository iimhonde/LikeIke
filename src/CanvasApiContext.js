import React, { createContext, useContext, useState } from 'react';

// Create the CanvasApi context
const CanvasApiContext = createContext(null);

// Custom hook for easy access to the CanvasApi context
export const useCanvasApi = () => useContext(CanvasApiContext);

// Provider component to wrap around the app
export const CanvasApiProvider = ({ children }) => {
    const [canvasApiInstance, setCanvasApiInstance] = useState(null);

    return (
        <CanvasApiContext.Provider value={{ canvasApiInstance, setCanvasApiInstance }}>
            {children}
        </CanvasApiContext.Provider>
    );
};
