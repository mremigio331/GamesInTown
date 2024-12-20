import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import GamesInTown from './GamesInTown';
import DarkModeProvider from './Provider/ThemeProvider';
import DeviceProvider from './Provider/DeviceProvider';

ReactDOM.render(
    <BrowserRouter>
        <DarkModeProvider>
            <DeviceProvider>
                <GamesInTown />
            </DeviceProvider>
        </DarkModeProvider>
    </BrowserRouter>,
    document.getElementById('app'),
);
