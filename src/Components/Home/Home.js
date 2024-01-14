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
        selectedMetroArea: action.type.selectedMetroArea,
        dateInfo: {
            type: action.type.dateInfo.type,
            startDate: action.type.dateInfo.startDate,
            endDate: action.type.dateInfo.endDate,
        },
    };
    return reducerReturn;
};

const ChangMetroAreaButton = ({ currentState, dispatch }) => {
    return (
        <Button
            onClick={() => {
                dispatch({
                    type: {
                        metroAreaCards: true,
                        selectedMetroArea: currentState.selectedMetroArea,
                        dateInfo: currentState.dateInfo,
                    },
                });
                return;
            }}
        >
            Change Metro Area
        </Button>
    );
};

const CloseMetroAreaButton = ({ currentState, dispatch }) => {
    return (
        <Button
            onClick={() => {
                dispatch({
                    type: {
                        metroAreaCards: false,
                        selectedMetroArea: currentState.selectedMetroArea,
                        dateInfo: currentState.dateInfo,
                    },
                });
                return;
            }}
        >
            Close Metro Area Cards
        </Button>
    );
};

const Home = () => {
    var today = new Date();
    var futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const startDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const endDate = futureDate.getFullYear() + '-' + (futureDate.getMonth() + 1) + '-' + futureDate.getDate();

    const initialState = {
        metroAreaCards: true,
        selectedMetroArea: Math.floor(Math.random() * TeamsCatalog.length),
        dateInfo: {
            type: 'absolute',
            startDate: startDate,
            endDate: endDate,
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
                                    currentState.metroAreaCards == false ? (
                                        <ChangMetroAreaButton currentState={currentState} dispatch={dispatch} />
                                    ) : (
                                        <CloseMetroAreaButton currentState={currentState} dispatch={dispatch} />
                                    )
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
                    </SpaceBetween>
                </ContentLayout>
            }
        />
    );
};

export default Home;
