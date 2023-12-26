import * as React from 'react';
import { TeamsCatalog } from '../../Data/MetroTeams';
import {
    CollectionPreferences,
    Cards,
    Button,
    Box,
    Header,
    Pagination,
    Popover,
    SpaceBetween,
    TextFilter,
} from '@cloudscape-design/components';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { getAllGames } from '../../api/api_calls';

const TeamPopover = ({ teamInfo }) => {
    return (
        <Box>
            <Popover
                content={
                    <SpaceBetween size="l">
                        <div>
                            <Box variant="awsui-key-label">City</Box>
                            <Box>{teamInfo.city}</Box>
                        </div>
                        <div>
                            <Box variant="awsui-key-label">State</Box>
                            <div>{teamInfo.state}</div>
                        </div>
                    </SpaceBetween>
                }
            >
                {teamInfo.teamName}
            </Popover>
        </Box>
    );
};

const MetroCards = ({ dispatch, currentState, allGames, setAllGames, loading, setLoading }) => {
    const { items, actions, filteredItemsCount, filterProps, paginationProps, collectionProps } = useCollection(
        TeamsCatalog,
        {
            filtering: {},
            pagination: { pageSize: 10 },
        },
    );

    const TeamsPagination = () => {
        return (
            <Pagination
                {...paginationProps}
                ariaLabels={{
                    nextPageLabel: 'Next Page',
                    previousPageLabel: 'Previous Page',
                    pageLabel: (pageNumber) => `Page ${pageNumber} of all pages`,
                }}
            />
        );
    };

    return (
        <Cards
            {...actions}
            {...collectionProps}
            stickyHeader
            stickyHeaderVerticalOffset={50}
            ariaLabels={{
                itemSelectionLabel: (e, n) => `select ${n.metroArea}`,
                selectionGroupLabel: 'Item selection',
            }}
            cardDefinition={{
                header: (item) => (
                    <Header
                        variant="h1"
                        counter={item.teams.length}
                        actions={
                            <Button
                                variant="primary"
                                onClick={async () => {
                                    dispatch({
                                        type: {
                                            metroAreaCards: false,
                                            selectedMetroArea: item.id,
                                            dateInfo: currentState.dateInfo,
                                        },
                                    });
                                    setLoading(true);
                                    const gamesReturn = await getAllGames(
                                        currentState.dateInfo.startDate,
                                        currentState.dateInfo.endDate,
                                        TeamsCatalog.find((metro) => metro.id === item.id).teams,
                                        TeamsCatalog.find((metro) => metro.id === item.id).stadiums,
                                    );
                                    setAllGames(gamesReturn);
                                    setLoading(false);
                                }}
                            >
                                Select Metro Area
                            </Button>
                        }
                    >
                        {item.metroArea}
                    </Header>
                ),
                sections: [
                    {
                        id: 'NFL',
                        header: 'NFL',
                        content: (item) =>
                            item.teams.map((team) => (team.league == 'NFL' ? <TeamPopover teamInfo={team} /> : null)),
                    },
                    {
                        id: 'NBA',
                        header: 'NBA',
                        content: (item) =>
                            item.teams.map((team) => (team.league == 'NBA' ? <TeamPopover teamInfo={team} /> : null)),
                    },
                    {
                        id: 'MLB',
                        header: 'MLB',
                        content: (item) =>
                            item.teams.map((team) => (team.league == 'MLB' ? <TeamPopover teamInfo={team} /> : null)),
                    },
                    {
                        id: 'NHL',
                        header: 'NHL',
                        content: (item) =>
                            item.teams.map((team) => (team.league == 'NHL' ? <TeamPopover teamInfo={team} /> : null)),
                    },
                    {
                        id: 'MLS',
                        header: 'MLS',
                        content: (item) =>
                            item.teams.map((team) => (team.league == 'MLS' ? <TeamPopover teamInfo={team} /> : null)),
                    },
                    {
                        id: 'Teams',
                        ccontent: (item) => item.teams.map((team) => team.teamName),
                    },
                ],
            }}
            cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 2 }]}
            items={items}
            loadingText="Loading resources"
            trackBy="name"
            visibleSections={['MLB', 'NBA', 'NFL', 'NHL']}
            empty={
                <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
                    <SpaceBetween size="m">
                        <b>No resources</b>
                        <Button>Create resource</Button>
                    </SpaceBetween>
                </Box>
            }
            filter={<TextFilter filteringPlaceholder="Metro Area" {...filterProps} />}
            header={<Header counter={filteredItemsCount}>Select A Metro Area</Header>}
            pagination={<TeamsPagination />}
            preferences={
                <CollectionPreferences
                    title="Preferences"
                    confirmLabel="Confirm"
                    cancelLabel="Cancel"
                    preferences={{
                        pageSize: 6,
                    }}
                />
            }
        />
    );
};

export default MetroCards;
