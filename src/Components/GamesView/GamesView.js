import * as React from 'react';
import {
    Cards,
    ColumnLayout,
    Box,
    Header,
    Link,
    SpaceBetween,
    Pagination,
    PropertyFilter,
} from '@cloudscape-design/components';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { VenueImageCollector } from '../../api/api_calls';
import { propertyFilteringProperties } from '../../config/PropertyFilteringProperties';
import { useDevice } from '../../Provider/DeviceProvider';

const GameCardHeader = ({ item }) => {
    const isMobile = useDevice();

    return (
        <SpaceBetween direction={'vertical'}>
            <SpaceBetween direction="horizontal" size="s">
                <Box fontSize={'display-l'} fontWeight="bold">
                    {item.awayTeam.logo && (
                        <img
                            width={isMobile ? '40' : '50'}
                            height={isMobile ? '40' : '50'}
                            src={item.awayTeam.logo}
                            alt={`${item.awayTeam.teamName} logo`}
                        />
                    )}
                    {item.awayTeam.teamName}
                </Box>
                <Box fontSize={isMobile ? 'body-s' : 'body-m'}>{item.awayTeam.record}</Box>
            </SpaceBetween>
            <Box fontSize={isMobile ? 'display-s' : 'display-m'}>@</Box>
            <SpaceBetween direction="horizontal" size="s">
                <Box fontSize={'display-l'} fontWeight="bold">
                    {item.homeTeam.logo && (
                        <img
                            width={isMobile ? '40' : '50'} // Smaller image size for isMobile
                            height={isMobile ? '40' : '50'}
                            src={item.homeTeam.logo}
                            alt={`${item.homeTeam.teamName} logo`}
                        />
                    )}
                    {item.homeTeam.teamName}
                </Box>
                <Box fontSize={isMobile ? 'body-s' : 'body-m'}>{item.homeTeam.record}</Box>
            </SpaceBetween>
        </SpaceBetween>
    );
};

const GameCardDescription = ({ item }) => {
    const isMobile = useDevice();
    const [venueImage, setVenueImage] = React.useState(null);

    const venueImageGrab = async () => {
        try {
            const image = await VenueImageCollector(item.location.venueId, item.sport, item.league.toLowerCase());
            setVenueImage(image);
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        venueImageGrab();
    }, []);

    return (
        <ColumnLayout columns={2} variant="text-grid">
            <div>
                <SpaceBetween size={isMobile ? 'xs' : 'm'}>
                    {item.gameNote != null && (
                        <Box fontSize={isMobile ? 'body-m' : 'display-l'} fontWeight="bold">
                            {item.gameNote}
                        </Box>
                    )}
                    <Box fontSize={isMobile ? 'body-s' : 'body-l'} fontWeight="bold">
                        Date/Time
                    </Box>
                    <Box fontSize={isMobile ? 'body-s' : 'body-l'}>{`${item.dayOfTheWeek} ${item.dateTime}`}</Box>
                    <Box fontSize={isMobile ? 'body-s' : 'body-l'} fontWeight="bold">
                        Venue
                    </Box>
                    <Box fontSize={isMobile ? 'body-s' : 'body-l'}>{`${item.location.venue}`}</Box>
                    <Box
                        fontSize={isMobile ? 'body-s' : 'body-l'}
                    >{`${item.location.city}, ${item.location.state}`}</Box>
                    <Box fontSize={isMobile ? 'body-s' : 'body-l'} fontWeight="bold">
                        Type
                    </Box>
                    <Box fontSize={isMobile ? 'body-s' : 'body-l'}>{item.gameType}</Box>
                </SpaceBetween>
            </div>
            <div>
                <SpaceBetween size={isMobile ? 'xs' : 'm'}>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                        height={isMobile ? '150px' : '300px'}
                    >
                        {venueImage && (
                            <img
                                src={venueImage}
                                alt={`${item.location.venue} venue`}
                                style={{
                                    width: isMobile ? '100%' : '25%',
                                    height: isMobile ? '100%' : '25%',
                                    objectFit: isMobile ? 'cover' : 'contain',
                                }}
                            />
                        )}
                    </Box>
                    <Box fontSize={isMobile ? 'body-m' : 'display-l'} fontWeight="bold" textAlign="right">
                        {item.tickets != null && (
                            <Link external variant="primary" href={item.tickets.links[0].href}>
                                {item.tickets.summary}
                            </Link>
                        )}
                    </Box>
                </SpaceBetween>
            </div>
        </ColumnLayout>
    );
};

const GamesCards = ({ currentState, allGames, setAllGames, loading, setLoading }) => {
    console.log('AllGamees', allGames);

    const { items, actions, filteredItemsCount, filterProps, paginationProps, collectionProps, propertyFilterProps } =
        useCollection(allGames, {
            propertyFiltering: {
                filteringProperties: propertyFilteringProperties,
            },
            pagination: { pageSize: 20 },
        });

    return (
        <>
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
                            id: 'league',
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
                filter={<PropertyFilter {...propertyFilterProps} />}
                pagination={<Pagination {...paginationProps} />}
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
        </>
    );
};

export default GamesCards;
