import * as React from 'react';
import { useState, useReducer } from 'react';
import axios from 'axios';
import { TeamsCatalog } from '../../Data/MetroTeams';
import { getGames, getAllGames } from '../../api/api_calls';
import { useQuery } from 'react-query';

import {
    AppLayout,
    Container,
    Cards,
    ContentLayout,
    ExpandableSection,
    Header,
    Modal,
    SegmentedControl,
    SpaceBetween,
    Button,
} from '@cloudscape-design/components';

import MetroCards from '../MetroCards/MetroCards';
import GamesCards from '../GamesView/GamesView';
import Calendar from '../GamesView/Calendar';

const gamesReturn = (currentState) => {
    return getAllGames(
        currentState.startDate,
        currentState.endDate,
        TeamsCatalog.find((metro) => metro.id === currentState.selectedMetroArea).teams,
    );
};

const allGames = async (action) => {
    let loading = true;
    let allGames = [];

    await getAllGames(
        action.type.startDate,
        action.type.endDate,
        TeamsCatalog.find((metro) => metro.id === action.type.selectedMetroArea).teams,
    ).then((resolution) => {
        allGames = resolution;
        loading = false;
    });

    return {
        loading: loading,
        games: allGames,
    };
};

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
    const [date, setDate] = React.useState({ type: 'absolute', startDate: startDate, endDate: endDate });

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
                                                date={date}
                                                setDate={setDate}
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
                                    date={date}
                                    setDate={setDate}
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
