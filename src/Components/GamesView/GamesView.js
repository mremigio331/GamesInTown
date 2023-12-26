import * as React from 'react';
import {
    Cards,
    ColumnLayout,
    Button,
    Box,
    Header,
    PropertyFilter,
    SpaceBetween,
    TextFilter,
} from '@cloudscape-design/components';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { VenuImageCollector } from '../../api/api_calls';

const GameCardHeader = ({ item }) => {
    return (
        <ColumnLayout columns={2} variant="text-grid">
            <div>
                <SpaceBetween>
                    <Box fontSize="display-l" fontWeight="bold">
                        {item.awayTeam.logo == null ? null : <img width="50" height="50" src={item.awayTeam.logo} />}
                        {item.awayTeam.teamName}
                    </Box>
                    <Box>{item.awayTeam.record}</Box>
                </SpaceBetween>
            </div>
            <div>
                <SpaceBetween>
                    <Box fontSize="display-l" fontWeight="bold" float="right">
                        {item.homeTeam.teamName}
                        {item.awayTeam.logo == null ? null : <img width="50" height="50" src={item.homeTeam.logo} />}
                        <Box fontSize="display-l" fontWeight="bold"></Box>
                    </Box>
                    <Box float="right">{item.homeTeam.record}</Box>
                </SpaceBetween>
            </div>
        </ColumnLayout>
    );
};

const GameCardDescription = ({ item }) => {
    const [venueImage, setVenueImage] = React.useState(null);
    const venueImageGrab = async () => {
        await VenuImageCollector(item.location.venueId, item.sport, item.league.toLowerCase())
            .then((image) => {
                setVenueImage(image);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    venueImageGrab();

    return (
        <ColumnLayout columns={2} variant="text-grid">
            <div>
                <SpaceBetween>
                    {
                        item.gameNote != null &&  <Box variant="h2">{item.gameNote}</Box>
                    }
                    <Box variant="awsui-key-label">Date/Time</Box>
                    <div>{`${item.dayOfTheWeek} ${item.dateTime}`}</div>
                    <Box variant="awsui-key-label">Venu</Box>
                    <div>{`${item.location.venue} (Capacity: ${item.location.capacity})`}</div>
                    <div>{`${item.location.city}, ${item.location.state}`}</div>
                    <Box variant="awsui-key-label">Type</Box>
                    <div>{item.gameType}</div>
                </SpaceBetween>
            </div>
            <div>
                <SpaceBetween>
                    <Box float="right">
                        {venueImage == null ? null : <img width="400" height="200" src={venueImage} />}
                    </Box>
                </SpaceBetween>
            </div>
        </ColumnLayout>
    );
};

const GamesCards = ({ currentState, allGames, setAllGames, loading, setLoading }) => {
    const { items, actions, filteredItemsCount, filterProps, paginationProps, collectionProps, propertyFilterProps } =
        useCollection(allGames, {
            filtering: {},
            pagination: { pageSize: 10 },
        });

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
                header: (item) => <GameCardHeader item={item} />,
                sections: [
                    {
                        id: 'gameInfo',
                        content: (item) => <GameCardDescription item={item} />,
                    },
                    {
                        id: 'time',
                        header: 'Date Time',
                        content: (item) => `${item.dayOfTheWeek} ${item.dateTime}`,
                    },
                    {
                        id: 'venue',
                        header: 'Venue',
                        content: (item) => `${item.location.venue} (Capacity: ${item.location.capacity})`,
                    },
                    {
                        id: 'location',
                        header: 'Location',
                        content: (item) => `${item.location.city}, ${item.location.state}`,
                    },
                    {
                        id: 'gameType',
                        header: 'Game Type',
                        content: (item) => item.gameType,
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
            visibleSections={['gameInfo']}
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
            header={<Header counter={filteredItemsCount}>Games</Header>}
        />
    );
};

export default GamesCards;
