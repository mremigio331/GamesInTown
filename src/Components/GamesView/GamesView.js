import * as React from 'react';
import { Cards, ColumnLayout, Button, Box, Header, SpaceBetween, TextFilter } from '@cloudscape-design/components';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { getAllGames } from '../../api/api_calls';
import { TeamsCatalog } from '../../Data/MetroTeams';

const GamesCards = ({ currentState, allGames, setAllGames, loading, setLoading }) => {
    const { items, actions, filteredItemsCount, filterProps, paginationProps, collectionProps } = useCollection(
        allGames,
        {
            filtering: {},
            pagination: { pageSize: 10 },
        },
    );

    return (
        <Cards
            {...actions}
            {...collectionProps}
            stickyHeader
            stickyHeaderVerticalOffset={20}
            ariaLabels={{
                itemSelectionLabel: (e, n) => `select ${n.metroArea}`,
                selectionGroupLabel: 'Item selection',
            }}
            cardDefinition={{
                header: (item) => (
                    <ColumnLayout columns={2} variant="text-grid">
                        <div>
                            <SpaceBetween>
                                <Box fontSize="display-l" fontWeight="bold">
                                    {item.awayTeam.logo == null ? null : (
                                        <img width="50" height="50" src={item.awayTeam.logo} />
                                    )}
                                    {item.awayTeam.teamName}
                                </Box>
                                <Box>{item.awayTeam.record}</Box>
                            </SpaceBetween>
                        </div>
                        <div>
                            <SpaceBetween>
                                <Box fontSize="display-l" fontWeight="bold" float="right">
                                    {item.homeTeam.teamName}
                                    {item.awayTeam.logo == null ? null : (
                                        <img width="50" height="50" src={item.homeTeam.logo} />
                                    )}
                                    <Box fontSize="display-l" fontWeight="bold"></Box>
                                </Box>
                                <Box float="right">{item.homeTeam.record}</Box>
                            </SpaceBetween>
                        </div>
                    </ColumnLayout>
                ),
                sections: [
                    {
                        id: 'time',
                        header: 'Time',
                        content: (item) => item.dateTime,
                    },
                    {
                        id: 'location',
                        header: 'Location',
                        content: (item) => item.location,
                    },
                    {
                        id: 'leage',
                        header: 'League',
                        content: (item) => item.league,
                    },
                    {
                        id: 'homeTeam',
                        header: 'HomeTeam',
                        content: (item) => item.homeTeam.teamName,
                    },
                    {
                        id: 'awayTeam',
                        header: 'awayTeam',
                        content: (item) => item.awayTeam.teamName,
                    },
                ],
            }}
            filter={<TextFilter filteringPlaceholder="Teams" {...filterProps} />}
            visibleSections={['time', 'location', 'league']}
            cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 1 }]}
            items={items}
            loading={loading}
            loadingText="Loading Games"
            empty={
                <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
                    <SpaceBetween size="m">
                        <b>No Games</b>
                    </SpaceBetween>
                </Box>
            }
            header={
                <Header
                    actions={
                        <Button
                            onClick={async () => {
                                setLoading(true);
                                const gamesReturn = await getAllGames(
                                    currentState.startDate,
                                    currentState.endDate,
                                    TeamsCatalog.find((metro) => metro.id === currentState.selectedMetroArea).teams,
                                );
                                setAllGames(gamesReturn);
                                setLoading(false);
                            }}
                        >
                            Load Games
                        </Button>
                    }
                >
                    Games
                </Header>
            }
        />
    );
};

const GamesView = () => {
    <Container>
        <GamesCards />
    </Container>;
};

export default GamesCards;
