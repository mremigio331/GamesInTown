import * as React from 'react';
import { TopNavigation } from '@cloudscape-design/components';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from './Provider/ThemeProvider';

export default function NavigationBar() {
    const navigate = useNavigate();
    const handleClick = (event) => {
        event.preventDefault();
        navigate(event.detail.href);
    };

    const { theme, toggleTheme } = useDarkMode();

    return (
        <TopNavigation
            identity={{
                href: '/',
                title: 'Teams In Town',
            }}
            utilities={[
                {
                    type: 'button',
                    text: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
                    onClick: toggleTheme,
                },
            ]}
        />
    );
}
