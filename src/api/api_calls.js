import * as React from 'react';

import axios from 'axios';
import { NFLWeeks } from '../Data/NLFWeeks';
import { AllTeams } from '../Data/AllTeamsInfo';

export const getAllGames = async (start_date, end_date, metroAreaTeams) => {
    let allGamesReturn = [];
    const mlb = await MLBAPI(start_date, end_date, metroAreaTeams);
    const nhl = await NHLAPI(start_date, end_date, metroAreaTeams);
    const nfl = await nflGrab(start_date, end_date, metroAreaTeams);
    mlb.map((game) => allGamesReturn.push(game));
    nhl.map((game) => allGamesReturn.push(game));
    nfl.map((game) => allGamesReturn.push(game));

    allGamesReturn.sort((a, b) => {
        const dateA = new Date(a.dateTime);
        const dateB = new Date(b.dateTime);
        return dateA - dateB;
    });
    return allGamesReturn;
};

export const getGames = (start_date, end_date, metroAreaTeams) => {
    const { isLoading } = useSelector((state) => state.tableReducer);
    getAllGames(start_date, end_date, metroAreaTeams);

    if (isLoading)
        return {
            isLoading: isLoading,
            error: error,
            allGames: [],
        };
    return {
        isLoading: isLoading,
        error: error,
        allGames: data,
    };
};

// NFL Functions
const nflGrab = async (start_date, end_date, metroAreaTeams) => {
    const weeksGood = WeeksIdentifer(start_date, end_date);
    let nflGames = [];
    await Promise.all(
        weeksGood.map(async (week) => {
            const nflWeek = await NFLAPI(week);
            for (const key in nflWeek.content.schedule) {
                if (nflWeek.content.schedule.hasOwnProperty(key)) {
                    nflGames.push(...nflWeek.content.schedule[key].games);
                }
            }
        }),
    );

    return NFLScrubber(start_date, end_date, metroAreaTeams, nflGames);
};

const NFLAPI = async (week) => {
    const requestURL = `https://cdn.espn.com/core/nfl/schedule?xhr=1&year=2023&week=${week}`;
    console.log(requestURL);
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

const NFLScrubber = (start_date, end_date, metroAreaTeams, games) => {
    let NFLTeams = metroAreaTeams.filter(function (metroAreaTeams) {
        return metroAreaTeams.league == 'NFL';
    });
    NFLTeams = NFLTeams.map((team) => team.teamName);
    let NFLGames = [];
    games.map((game) => {
        const homeTeam = game.competitions[0].competitors[0].team.displayName;
        const awayTeam = game.competitions[0].competitors[1].team.displayName;
        const homeRecord = game.competitions[0].competitors[0].records[1].summary;
        const awayRecord = game.competitions[0].competitors[0].records[1].summary;
        const homeLogo = homeTeam.replace(/\s/g, '');
        const awayLogo = awayTeam.replace(/\s/g, '');

        NFLTeams.includes(homeTeam)
            ? NFLGames.push({
                  dateTime: new Date(game.date).toLocaleString('en-US', {
                      timeZone: TimeZoneIdentifier(metroAreaTeams, homeTeam),
                  }),
                  location: game.competitions[0].venue.fullName,
                  homeTeam: {
                      teamName: homeTeam,
                      record: homeRecord,
                      logo: AllTeams[homeTeam].logo,
                  },
                  awayTeam: {
                      teamName: awayTeam,
                      record: awayRecord,
                      logo: AllTeams[awayTeam].logo,
                  },
                  league: 'NFL',
                  fullInfo: game,
              })
            : null;
    });

    return NFLGames;
};

const WeeksIdentifer = (start_date, end_date) => {
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    let weeks = [];
    NFLWeeks.map((nflWeek) => {
        const currentStart = new Date(nflWeek.start_date);
        const currentEnd = new Date(nflWeek.end_date);
        const weekGood =
            (startDate > currentStart && startDate < currentEnd) ||
            (currentStart > startDate && currentStart < endDate);
        weekGood === true ? weeks.push(nflWeek.week) : null;
    });
    return weeks;
};

// MLB Functions
const MLBAPI = async (start_date, end_date, metroAreaTeams) => {
    const requestURL = `https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&startDate=${start_date}&endDate=${end_date}`;
    console.log(requestURL);
    const response = await axios
        .get(requestURL)
        .then((res) => {
            return res;
        })
        .catch((error) => {
            return error;
        });

    return MLBScrubber(metroAreaTeams, response.data);
};

const MLBScrubber = (metroAreaTeams, response) => {
    let MLBTeams = metroAreaTeams.filter(function (metroAreaTeams) {
        return metroAreaTeams.league == 'MLB';
    });
    MLBTeams = MLBTeams.map((team) => team.teamName);
    let MLBGames = [];
    response.dates.map((day) =>
        day.games.map((game) => {
            const homeTeam = game.teams.home.team.name;
            const awayTeam = game.teams.away.team.name;
            const homeRecord = game.teams.home.leagueRecord;
            const awayRecord = game.teams.away.leagueRecord;
            const homeLogo = homeTeam.replace(/\s/g, '');
            const awayLogo = awayTeam.replace(/\s/g, '');
            MLBTeams.includes(game.teams.home.team.name)
                ? MLBGames.push({
                      dateTime: new Date(game.gameDate).toLocaleString('en-US', {
                          timeZone: TimeZoneIdentifier(metroAreaTeams, game.teams.home.team.name),
                      }),
                      location: game.venue.name,
                      homeTeam: {
                          teamName: homeTeam,
                          record: `${homeRecord.wins}-${homeRecord.losses}`,
                          logo: AllTeams[homeTeam].logo,
                      },
                      awayTeam: {
                          teamName: awayTeam,
                          record: `${awayRecord.wins}-${awayRecord.losses}`,
                          logo: AllTeams[awayTeam].logo,
                      },
                      league: 'MLB',
                      fullInfo: game,
                  })
                : null;
        }),
    );
    return MLBGames;
};

// NHL Functions
const NHLAPI = async (start_date, end_date, metroAreaTeams) => {
    const requestURL = `https://statsapi.web.nhl.com/api/v1/schedule??sportId=1&startDate=${start_date}&endDate=${end_date}`;
    console.log(requestURL);

    const response = await axios
        .get(requestURL)
        .then((res) => {
            return res;
        })
        .catch((error) => {
            return error;
        });

    return NHLScrubber(metroAreaTeams, response.data);
};

const NHLScrubber = (metroAreaTeams, response) => {
    let NHLTeams = metroAreaTeams.filter(function (metroAreaTeams) {
        return metroAreaTeams.league == 'NHL';
    });
    NHLTeams = NHLTeams.map((team) => team.teamName);
    let NHLGames = [];
    response.dates.map((day) =>
        day.games.map((game) => {
            const homeTeam = game.teams.home.team.name;
            const awayTeam = game.teams.away.team.name;
            const homeRecord = game.teams.home.leagueRecord;
            const awayRecord = game.teams.away.leagueRecord;
            const logo = (team) => {
                try {
                    return AllTeams[team].logo; //.logo.replace(/[\u0300-\u036f]/g, "")
                } catch (error) {
                    console.error(error);
                    return null;
                }
            };
            NHLTeams.includes(game.teams.home.team.name)
                ? NHLGames.push({
                      dateTime: new Date(game.gameDate).toLocaleString('en-US', {
                          timeZone: TimeZoneIdentifier(metroAreaTeams, game.teams.home.team.name),
                      }),
                      location: game.venue.name,
                      homeTeam: {
                          teamName: homeTeam,
                          record: `${homeRecord.wins}-${homeRecord.losses}-${homeRecord.ot}`,
                          logo: logo(homeTeam),
                      },
                      awayTeam: {
                          teamName: awayTeam,
                          record: `${awayRecord.wins}-${awayRecord.losses}-${awayRecord.ot}`,
                          logo: logo(awayTeam),
                      },
                      league: 'NHL',
                      fullInfo: game,
                  })
                : null;
        }),
    );
    return NHLGames;
};

const TimeZoneIdentifier = (metroAreaTeams, specificTeam) => {
    let highlightTeamInfo = metroAreaTeams.filter(function (metroAreaTeams) {
        return metroAreaTeams.teamName == specificTeam;
    });
    return highlightTeamInfo[0].timeZone;
};
