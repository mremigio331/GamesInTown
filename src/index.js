import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import GamesInTown from './GamesInTown';
import DarkModeProvider from './Provider/ThemeProvider';

ReactDOM.render(
    <BrowserRouter>
        <DarkModeProvider>
            <GamesInTown />
        </DarkModeProvider>
    </BrowserRouter>,
    document.getElementById('app'),
);
