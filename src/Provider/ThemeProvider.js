import React, { createContext, useContext, useState } from 'react';

// Create the context
const DarkModeContext = createContext();

// Create the provider component
export const DarkModeProvider = ({ children }) => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = prefersDarkMode ? 'dark' : 'light';

    const [theme, setTheme] = useState(defaultTheme);

    // Function to toggle between "light" and "dark"
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return <DarkModeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</DarkModeContext.Provider>;
};

// Custom hook to use the context
export const useDarkMode = () => {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error('useDarkMode must be used within a DarkModeProvider');
    }
    return context;
};

export default DarkModeProvider;
