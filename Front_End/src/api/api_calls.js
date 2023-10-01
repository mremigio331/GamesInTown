import * as React from 'react';
import axios from 'axios';
import { NFLWeeks } from '../Data/NLFWeeks';
import { AllTeams } from '../Data/AllTeamsInfo';

export const getAllGames = async (start_date, end_date, metroAreaTeams) => {
    let allGamesReturn = [];
    const mlb = await FullGamesReturn(start_date, end_date, metroAreaTeams, 'baseball', 'mlb'); //MLBAPI(start_date, end_date, metroAreaTeams);
    const nhl = await FullGamesReturn(start_date, end_date, metroAreaTeams, 'hockey', 'nhl');
    const nfl = await FullGamesReturn(start_date, end_date, metroAreaTeams, 'football', 'nfl'); //NFLGrab(start_date, end_date, metroAreaTeams);
    const nba = await FullGamesReturn(start_date, end_date, metroAreaTeams, 'basketball', 'nba');
    mlb.map((game) => allGamesReturn.push(game));
    nhl.map((game) => allGamesReturn.push(game));
    nfl.map((game) => allGamesReturn.push(game));
    nba.map((game) => allGamesReturn.push(game));

    allGamesReturn.sort((a, b) => {
        const dateA = new Date(a.dateTime);
        const dateB = new Date(b.dateTime);
        return dateA - dateB;
    });
    return allGamesReturn;
};

const FullGamesReturn = async (start_date, end_date, metroAreaTeams, sport, league) => {
    const datesLookup = DatesIdentifier(start_date, end_date);
    let games = [];
    await Promise.all(
        datesLookup.map(async (date) => {
            const dateGames = await ESPNAPI(sport, league.toLowerCase(), date);
            dateGames.events.map((game) => games.push(game));
        }),
    );
    return ESPNScrubber(metroAreaTeams, games, league.toUpperCase());
};

const TimeZoneIdentifier = (metroAreaTeams, specificTeam) => {
    let highlightTeamInfo = metroAreaTeams.filter(function (metroAreaTeams) {
        return metroAreaTeams.teamName == specificTeam;
    });
    return highlightTeamInfo[0].timeZone;
};

const DatesIdentifier = (start_date, end_date) => {
    for (var dates = [], dt = new Date(start_date); dt <= new Date(end_date); dt.setDate(dt.getDate() + 1)) {
        dates.push(new Date(dt).toISOString().split('T')[0].replaceAll('-', ''));
    }
    return dates;
};

const ESPNAPI = async (sport, league, date) => {
    const requestURL = `http://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard?calendartype=whitelist&limit=100&dates=${date}`;
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

const ESPNScrubber = (metroAreaTeams, games, league) => {
    let Teams = metroAreaTeams.filter(function (metroAreaTeams) {
        return metroAreaTeams.league == league;
    });
    Teams = Teams.map((team) => team.teamName);
    let AllGames = [];
    games.map((game) => {
        const homeTeam = game.competitions[0].competitors[0].team.displayName;
        const awayTeam = game.competitions[0].competitors[1].team.displayName;
        const neutralSite = game.competitions[0].neutralSite;
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

        Teams.includes(homeTeam)
            ? neutralSite == false &&
              AllGames.push({
                  dateTime: new Date(game.date).toLocaleString('en-US', {
                      timeZone: TimeZoneIdentifier(metroAreaTeams, homeTeam),
                  }),
                  location: {
                      venue: game.competitions[0].venue.fullName,
                      city: game.competitions[0].venue.address.city,
                      state: game.competitions[0].venue.address.state,
                      capacity: game.competitions[0].venue.capacity,
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
                  league: league,
                  fullInfo: game,
                  gameType: game.season.slug.replace('-', ' ').replace(/(^\w|\s\w)/g, (m) => m.toUpperCase()),
              })
            : null;
    });
    return AllGames;
};
