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

// NFL Functions
const NFLGrab = async (start_date, end_date, metroAreaTeams) => {
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
            MLBTeams.includes(game.teams.home.team.name)
                ? MLBGames.push({
                      dateTime: new Date(game.gameDate).toLocaleString('en-US', {
                          timeZone: TimeZoneIdentifier(metroAreaTeams, game.teams.home.team.name),
                      }),
                      location: game.venue.name,
                      homeTeam: {
                          teamName: homeTeam,
                          record: `${homeRecord.wins}-${homeRecord.losses}`,
                          logo: AllTeams.hasOwnProperty(homeTeam) ? AllTeams[homeTeam].logo : null,
                      },
                      awayTeam: {
                          teamName: awayTeam,
                          record: `${awayRecord.wins}-${awayRecord.losses}`,
                          logo: AllTeams.hasOwnProperty(awayTeam) ? AllTeams[awayTeam].logo : null,
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
const FullGamesReturn = async (start_date, end_date, metroAreaTeams, sport, league) => {
    //const requestURL = `https://statsapi.web.nhl.com/api/v1/schedule??sportId=1&startDate=${start_date}&endDate=${end_date}`;
    //
    //const response = await axios
    //    .get(requestURL)
    //    .then((res) => {
    //        return res;
    //    })
    //    .catch((error) => {
    //        return error;
    //    });
    //
    //return NHLScrubber(metroAreaTeams, response.data);
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

// NBA Functions
const NBAGrab = async (start_date, end_date, metroAreaTeams) => {
    const datesLookup = DatesIdentifier(start_date, end_date);
    let nbaGames = [];
    await Promise.all(
        datesLookup.map(async (date) => {
            const nbaDate = await ESPNAPI('basketball', 'nba', date);
            nbaDate.events.map((game) => nbaGames.push(game));
        }),
    );
    return ESPNScrubber(metroAreaTeams, nbaGames, 'NBA');
};

const DatesIdentifier = (start_date, end_date) => {
    for (var dates = [], dt = new Date(start_date); dt <= new Date(end_date); dt.setDate(dt.getDate() + 1)) {
        dates.push(new Date(dt).toISOString().split('T')[0].replaceAll('-', ''));
    }
    return dates;
};

const ESPNAPI = async (sport, league, date) => {
    const requestURL = `http://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard?calendartype=whitelist&limit=100&dates=${date}`;
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

const ESPNScrubber = (metroAreaTeams, games, league) => {
    let Teams = metroAreaTeams.filter(function (metroAreaTeams) {
        return metroAreaTeams.league == league;
    });
    Teams = Teams.map((team) => team.teamName);
    let AllGames = [];
    games.map((game) => {
        const homeTeam = game.competitions[0].competitors[0].team.displayName;
        const awayTeam = game.competitions[0].competitors[1].team.displayName;
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
            ? AllGames.push({
                  dateTime: new Date(game.date).toLocaleString('en-US', {
                      timeZone: TimeZoneIdentifier(metroAreaTeams, homeTeam),
                  }),
                  location: game.competitions[0].venue.fullName,
                  homeTeam: {
                      teamName: homeTeam,
                      record: homeRecord,
                      logo: game.competitions[0].competitors[0].team.logo,
                  },
                  awayTeam: {
                      teamName: awayTeam,
                      record: awayRecord,
                      logo: game.competitions[0].competitors[1].team.logo,
                  },
                  league: league,
                  fullInfo: game,
              })
            : null;
    });
    console.log(AllGames);
    return AllGames;
};
