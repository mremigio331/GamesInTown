import * as React from 'react';
import DateRangePicker from '@cloudscape-design/components/date-range-picker';
import { getAllGames } from '../../api/api_calls';
import { TeamsCatalog } from '../../Data/MetroTeams';

export default ({ dispatch, currentState, allGames, setAllGames, loading, setLoading }) => {
    return (
        <DateRangePicker
            onChange={async ({ detail }) => {
                dispatch({
                    type: {
                        metroAreaCards: currentState.metroAreaCards,
                        selectedMetroArea: currentState.selectedMetroArea,
                        dateInfo: {
                            type: currentState.dateInfo.type,
                            startDate: detail.value.startDate,
                            endDate: detail.value.endDate,
                        },
                    },
                });
                setLoading(true);
                const gamesReturn = await getAllGames(
                    detail.value.startDate,
                    detail.value.endDate,
                    TeamsCatalog.find((metro) => metro.id === currentState.selectedMetroArea).teams,
                    TeamsCatalog.find((metro) => metro.id === currentState.selectedMetroArea).stadiums,
                );
                setAllGames(gamesReturn);
                setLoading(false);
            }}
            value={currentState.dateInfo}
            dateOnly
            isValidRange={(range) => {
                if (range.type === 'absolute') {
                    const [startDateWithoutTime] = range.startDate.split('T');
                    const [endDateWithoutTime] = range.endDate.split('T');
                    if (!startDateWithoutTime || !endDateWithoutTime) {
                        return {
                            valid: false,
                            errorMessage:
                                'The selected date range is incomplete. Select a start and end date for the date range.',
                        };
                    }
                    if (new Date(range.startDate) - new Date(range.endDate) > 0) {
                        return {
                            valid: false,
                            errorMessage:
                                'The selected date range is invalid. The start date must be before the end date.',
                        };
                    }
                }
                return { valid: true };
            }}
            i18nStrings={{
                cancelButtonLabel: 'Cancel',
                applyButtonLabel: 'Apply',
            }}
            rangeSelectorMode="absolute-only"
            placeholder="Filter by a date and time range"
        />
    );
};
