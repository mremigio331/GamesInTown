import * as React from 'react';
import { useReducer } from 'react';
import { TeamsCatalog } from '../../Data/MetroTeams';

import { AppLayout, Container, ContentLayout, Header, SpaceBetween, Button } from '@cloudscape-design/components';

import MetroCards from '../MetroCards/MetroCards';
import GamesCards from '../GamesView/GamesView';
import Calendar from '../GamesView/Calendar';

const reducer = (state, action) => {
    const reducerReturn = {
        metroAreaCards: action.type.metroAreaCards,
        gameLoad: action.type.gameLoad,
        selectedMetroArea: action.type.selectedMetroArea,
        startDate: action.type.startDate,
        endDate: action.type.endDate,
        allGames: [],
    };
    return reducerReturn;
};

const Home = () => {
    var today = new Date();
    var futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const startDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const endDate = futureDate.getFullYear() + '-' + (futureDate.getMonth() + 1) + '-' + futureDate.getDate();

    const initialState = {
        metroAreaCards: true,
        gameLoad: true,
        selectedMetroArea: Math.floor(Math.random() * TeamsCatalog.length),
        startDate: startDate,
        endDate: endDate,
        allGames: {
            loading: true,
            error: false,
            allGames: [],
        },
    };
    const [currentState, dispatch] = useReducer(reducer, initialState);
    const [loading, setLoading] = React.useState(true);
    const [allGames, setAllGames] = React.useState([]);

    return (
        <AppLayout
            headerSelector="#h"
            navigationHide
            toolsHide
            content={
                <ContentLayout
                    header={
                        <SpaceBetween size="m">
                            <Header
                                variant="h1"
                                description="Who's Playing When I'm In...."
                                actions={
                                    <Button
                                        onClick={() => {
                                            dispatch({
                                                type: {
                                                    metroAreaCards: true,
                                                    gameLoad: false,
                                                    selectedMetroArea: currentState.selectedMetroArea,
                                                    startDate: currentState.startDate,
                                                    endDate: currentState.endDate,
                                                    allGames: currentState.allGames,
                                                },
                                            });
                                        }}
                                    >
                                        Change Metro Area
                                    </Button>
                                }
                            >
                                Games In Town
                            </Header>
                        </SpaceBetween>
                    }
                >
                    <SpaceBetween>
                        {currentState.metroAreaCards === true ? (
                            <Container>
                                <MetroCards
                                    dispatch={dispatch}
                                    currentState={currentState}
                                    allGames={allGames}
                                    setAllGames={setAllGames}
                                    loading={loading}
                                    setLoading={setLoading}
                                />
                            </Container>
                        ) : null}
                        {currentState.gameLoad === true ? (
                            <Container
                                header={
                                    <Header
                                        variant="h1"
                                        actions={
                                            <Calendar
                                                dispatch={dispatch}
                                                currentState={currentState}
                                                allGames={allGames}
                                                setAllGames={setAllGames}
                                                loading={loading}
                                                setLoading={setLoading}
                                            />
                                        }
                                    >
                                        Games In The{' '}
                                        {
                                            TeamsCatalog.find((metro) => metro.id === currentState.selectedMetroArea)
                                                .metroArea
                                        }{' '}
                                        Area
                                    </Header>
                                }
                            >
                                <GamesCards
                                    currentState={currentState}
                                    allGames={allGames}
                                    setAllGames={setAllGames}
                                    loading={loading}
                                    setLoading={setLoading}
                                />
                            </Container>
                        ) : null}
                    </SpaceBetween>
                </ContentLayout>
            }
        />
    );
};

export default Home;
