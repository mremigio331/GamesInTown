import * as React from 'react';
import axios from 'axios';

export const getAllGames = async (startDate, endDate, metroAreaTeams, stadiums) => {
    let allGamesReturn = [];
    // baseball
    const mlb = await FullGamesReturn(startDate, endDate, metroAreaTeams, stadiums, 'baseball', 'mlb');

    // hockey
    const nhl = await FullGamesReturn(startDate, endDate, metroAreaTeams, stadiums, 'hockey', 'nhl');

    // football
    const nfl = await FullGamesReturn(startDate, endDate, metroAreaTeams, stadiums, 'football', 'nfl');
    const ncaaFootball = await FullGamesReturn(
        startDate,
        endDate,
        metroAreaTeams,
        stadiums,
        'football',
        'college-football',
    );

    // basketball
    const nba = await FullGamesReturn(startDate, endDate, metroAreaTeams, stadiums, 'basketball', 'nba');
    const wnba = await FullGamesReturn(startDate, endDate, metroAreaTeams, stadiums, 'basketball', 'wnba');
    const ncaaMensBasketball = await FullGamesReturn(
        startDate,
        endDate,
        metroAreaTeams,
        stadiums,
        'basketball',
        'mens-college-basketball',
    );
    const ncaaWomensBasketball = await FullGamesReturn(
        startDate,
        endDate,
        metroAreaTeams,
        stadiums,
        'basketball',
        'womens-college-basketball',
    );

    // soccer
    const mls = await FullGamesReturn(startDate, endDate, metroAreaTeams, stadiums, 'soccer', 'usa.1');

    mlb.map((game) => allGamesReturn.push(game));

    nhl.map((game) => allGamesReturn.push(game));

    nfl.map((game) => allGamesReturn.push(game));
    ncaaFootball.map((game) => allGamesReturn.push(game));

    nba.map((game) => allGamesReturn.push(game));
    wnba.map((game) => allGamesReturn.push(game));
    ncaaMensBasketball.map((game) => allGamesReturn.push(game));
    ncaaWomensBasketball.map((game) => allGamesReturn.push(game));

    mls.map((game) => allGamesReturn.push(game));

    allGamesReturn.sort((a, b) => {
        const dateA = new Date(a.dateTime);
        const dateB = new Date(b.dateTime);
        return dateA - dateB;
    });
    return allGamesReturn;
};

const FullGamesReturn = async (startDate, endDate, metroAreaTeams, stadiums, sport, league) => {
    const datesLookup = DatesIdentifier(startDate, endDate);
    let games = [];
    await Promise.all(
        datesLookup.map(async (date) => {
            const dateGames = await ESPNAPI(sport, league.toLowerCase(), date);
            dateGames.events.map((game) => games.push(game));
        }),
    );
    return UpdatedESPNScrubber(metroAreaTeams, stadiums, games, league.toUpperCase(), sport);
};

const TimeZoneIdentifier = (metroAreaTeams, specificTeam) => {
    let highlightTeamInfo = metroAreaTeams.filter(function (metroAreaTeams) {
        return metroAreaTeams.teamName == specificTeam;
    });
    try {
        return highlightTeamInfo[0].timeZone;
    } catch {
        return metroAreaTeams[0].timeZone;
    }
};

const DatesIdentifier = (startDate, endDate) => {
    startDate = startDate.replaceAll('-', '/');
    endDate = endDate.replaceAll('-', '/');

    for (var dates = [], dt = new Date(startDate); dt <= new Date(endDate); dt.setDate(dt.getDate() + 1)) {
        dates.push(new Date(dt).toISOString().split('T')[0].replaceAll('-', ''));
    }
    return dates;
};

const ESPNAPI = async (sport, league, date) => {
    const requestURL = `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard?calendartype=whitelist&limit=100&dates=${date}`;
    const response = await axios
        .get(requestURL)
        .then((res) => {
            return res;
        })
        .catch((error) => {
            return error;
        });

    return response.data;
};

const UpdatedESPNScrubber = async (metroAreaTeams, stadiums, games, league, sport) => {
    let allGames = [];

    games.forEach((game) => {
        try {
            const venueID = game.competitions[0].venue.id;
        const venueName = game.competitions[0].venue.fullName;

        const stadiumInfo = stadiums.find((info) => info.id == venueID && info.venue_name == venueName);

        if (stadiumInfo) {
            const homeTeam = game.competitions[0].competitors[0].team.displayName;
            const awayTeam = game.competitions[0].competitors[1].team.displayName;
            const neutralSite = game.competitions[0].neutralSite;
            const gameNote = game.competitions[0].notes.length > 0 ? game.competitions[0].notes[0].headline : null;
            const homeRecord = () => {
                try {
                    return game.competitions[0].competitors[0].records[0].summary;
                } catch {
                    return null;
                }
            };

            const awayRecord = () => {
                try {
                    return game.competitions[0].competitors[1].records[0].summary;
                } catch {
                    return null;
                }
            };

            const dateTime = new Date(game.date).toLocaleString('en-US', {
                timeZone: TimeZoneIdentifier(metroAreaTeams, homeTeam),
            });

            const dayOfTheWeek = DAYNAMES[new Date(dateTime).getDay()];
            allGames.push({
                dateTime: dateTime,
                dayOfTheWeek: dayOfTheWeek,
                location: {
                    venue: game.competitions[0].venue.fullName,
                    city: game.competitions[0].venue.address.city,
                    state: game.competitions[0].venue.address.state,
                    capacity: game.competitions[0].venue.capacity,
                    venueId: game.competitions[0].venue.id,
                },
                homeTeam: {
                    teamName: homeTeam,
                    record: homeRecord(),
                    logo: game.competitions[0].competitors[0].team.logo,
                },
                awayTeam: {
                    teamName: awayTeam,
                    record: awayRecord(),
                    logo: game.competitions[0].competitors[1].team.logo,
                },
                sport: sport,
                league: league,
                fullInfo: game,
                gameType: game.season.slug.replace('-', ' ').replace(/(^\w|\s\w)/g, (m) => m.toUpperCase()),
                neutralSite: neutralSite,
                gameNote: gameNote,
            })
        }
          } catch  {
            // most likely one of the games doesn't have the full info, safe to skip
          }
        
    });

    return allGames;
};

export const VenuImageCollector = async (venuID, sport, league) => {
    const requestURL = `https://sports.core.api.espn.com/v2/sports/${sport}/leagues/${league}/venues/${venuID}?lang=en&region=us`;
    const response = await axios
        .get(requestURL)
        .then((res) => {
            return res;
        })
        .catch((error) => {
            return error;
        });

    try {
        return response.data.images[0].href;
    } catch {
        return null;
    }
};

const DAYNAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
