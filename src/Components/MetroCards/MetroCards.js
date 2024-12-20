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
import { useDevice } from '../../Provider/DeviceProvider';

const TeamPopover = ({ teamInfo, isMobile }) => {
    return (
        <Box>
            <Popover
                content={
                    <SpaceBetween size={isMobile ? 'xl' : 'l'}>
                        <div>
                            <Box fontSize={isMobile ? 'heading-m' : 'awsui-key-label'}>City</Box>
                            <Box fontSize={isMobile ? 'heading-m' : 'body-m'}>{teamInfo.city}</Box>
                        </div>
                        <div>
                            <Box fontSize={isMobile ? 'heading-m' : 'awsui-key-label'}>State</Box>
                            <Box fontSize={isMobile ? 'heading-m' : 'body-m'}>{teamInfo.state}</Box>
                        </div>
                    </SpaceBetween>
                }
            >
                <Box fontSize={isMobile ? 'heading-l' : 'heading-m'}>{teamInfo.teamName}</Box>
            </Popover>
        </Box>
    );
};

const MetroCards = ({ dispatch, currentState, allGames, setAllGames, loading, setLoading }) => {
    const { isMobile } = useDevice();

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
                        fontSize={isMobile ? 'display-l' : 'heading-m'} // Larger font size for mobile
                        actions={
                            <Button
                                fontSize={isMobile ? 'body-m' : 'body-s'} // Larger button text size for mobile
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
                        header: <Box fontSize={isMobile ? 'heading-m' : 'body-m'}>NFL</Box>,
                        content: (item) =>
                            item.teams.map((team) =>
                                team.league === 'NFL' ? <TeamPopover teamInfo={team} isMobile={isMobile} /> : null,
                            ),
                    },
                    {
                        id: 'NBA',
                        header: <Box fontSize={isMobile ? 'heading-m' : 'body-m'}>NBA</Box>,
                        content: (item) =>
                            item.teams.map((team) =>
                                team.league === 'NBA' ? <TeamPopover teamInfo={team} isMobile={isMobile} /> : null,
                            ),
                    },
                    {
                        id: 'MLB',
                        header: <Box fontSize={isMobile ? 'heading-m' : 'body-m'}>MLB</Box>,
                        content: (item) =>
                            item.teams.map((team) =>
                                team.league === 'MLB' ? <TeamPopover teamInfo={team} isMobile={isMobile} /> : null,
                            ),
                    },
                    {
                        id: 'NHL',
                        header: <Box fontSize={isMobile ? 'heading-m' : 'body-m'}>NHL</Box>,
                        content: (item) =>
                            item.teams.map((team) =>
                                team.league === 'NHL' ? <TeamPopover teamInfo={team} isMobile={isMobile} /> : null,
                            ),
                    },
                    {
                        id: 'MLS',
                        header: <Box fontSize={isMobile ? 'heading-m' : 'body-m'}>MLS</Box>,
                        content: (item) =>
                            item.teams.map((team) =>
                                team.league === 'MLS' ? <TeamPopover teamInfo={team} isMobile={isMobile} /> : null,
                            ),
                    },
                    {
                        id: 'Teams',
                        content: (item) =>
                            item.teams.map((team) => (
                                <Box fontSize={isMobile ? 'heading-s' : 'body-m'}>{team.teamName}</Box>
                            )),
                    },
                ],
            }}
            cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: isMobile ? 1 : 2 }]}
            items={items}
            loadingText="Loading Teams"
            trackBy="name"
            visibleSections={['MLB', 'NBA', 'NFL', 'NHL', 'MLS']}
            empty={
                <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
                    <SpaceBetween size="m">
                        <b>No resources</b>
                        <Button>Create resource</Button>
                    </SpaceBetween>
                </Box>
            }
            filter={<TextFilter filteringPlaceholder="Metro Area" {...filterProps} />}
            header={
                <Header fontSize={isMobile ? 'display-l' : 'heading-m'} counter={filteredItemsCount}>
                    Select A Metro Area
                </Header>
            }
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
