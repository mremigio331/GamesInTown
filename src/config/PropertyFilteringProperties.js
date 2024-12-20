const DEFAULT_FILTERING_OPERATORS = ['=', '!='];

export const propertyFilteringProperties = [
    {
        key: 'homeTeamName',
        operators: DEFAULT_FILTERING_OPERATORS,
        propertyLabel: 'Home Team',
    },
    {
        key: 'awayTeamName',
        operators: DEFAULT_FILTERING_OPERATORS,
        propertyLabel: 'Away Team',
    },
    {
        key: 'cityLocation',
        operators: DEFAULT_FILTERING_OPERATORS,
        propertyLabel: 'City',
    },
    {
        key: 'stateLocation',
        operators: DEFAULT_FILTERING_OPERATORS,
        propertyLabel: 'State',
    },
    {
        key: 'gameType',
        operators: DEFAULT_FILTERING_OPERATORS,
        propertyLabel: 'Game Type',
    },
    {
        key: 'league',
        operators: DEFAULT_FILTERING_OPERATORS,
        propertyLabel: 'League',
    },
    {
        key: 'sport',
        operators: DEFAULT_FILTERING_OPERATORS,
        propertyLabel: 'Sport',
    },
    {
        key: 'dayOfTheWeek',
        operators: DEFAULT_FILTERING_OPERATORS,
        propertyLabel: 'Day of the Week',
    },
];
