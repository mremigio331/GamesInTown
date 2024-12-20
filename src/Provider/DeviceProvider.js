import React, { createContext, useContext, useEffect, useState } from 'react';

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
    const [isMobile, setIsMobile] = useState(false);

    // Function to check if the device is mobile
    const checkIsMobile = () => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return /android|iphone|ipad|ipod|windows phone|iemobile|opera mini/i.test(userAgent);
    };

    useEffect(() => {
        const updateDeviceType = () => {
            setIsMobile(checkIsMobile());
        };

        // Initial check
        updateDeviceType();

        // Optional: Listen to window resize to update dynamically
        window.addEventListener('resize', updateDeviceType);

        return () => {
            window.removeEventListener('resize', updateDeviceType);
        };
    }, []);

    return <DeviceContext.Provider value={{ isMobile }}>{children}</DeviceContext.Provider>;
};

export const useDevice = () => {
    const context = useContext(DeviceContext);
    if (!context) {
        throw new Error('useDevice must be used within a DeviceProvider');
    }
    return context;
};

export default DeviceProvider;
