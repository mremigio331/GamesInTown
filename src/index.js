import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import GamesInTown from './GamesInTown';

ReactDOM.render(
    <BrowserRouter>
        <GamesInTown />
    </BrowserRouter>,
    document.getElementById('app'),
);
