import * as React from 'react';
import '@cloudscape-design/components';
import NavBar from './NavBar';
import PageLocations from './Components/PageLocations/PageLocations';

const GamesInTown = () => {
    document.title = 'Teams In Town';
    return (
        <div>
            <div style={{ position: 'sticky', top: 0, zIndex: 1002 }}>
                <NavBar />
            </div>
            {<PageLocations />}
        </div>
    );
};

export default GamesInTown;
