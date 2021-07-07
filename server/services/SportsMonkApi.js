const { Db } = require("../db/index.js");
const fetch = require('node-fetch');
const { api_token } = require("../config/index.json");

const fetchData = async (url, params) => await fetch(url + `?api_token=${api_token}&${params}`).then((data) => data.json());

const fetchNewCompetitionsAndWriteToDb = async () => {
    const url = "https://soccer.sportmonks.com/api/v2.0/leagues"
    const { data: competitions } = await fetchData(url);
    let db = new Db("competitions");
    const currentCompetitions = await db.findElement({}, 0, 100);
    const newCompetitions = [];
    competitions.map(({ id,
        name,
        logo_path: cover }) => {
        if (!currentCompetitions.find((currentCompetition) => currentCompetition.id === id)) {

            newCompetitions.push({
                id,
                name,
                description: null,
                cover,
                available: true,
            })
        }
    })
    if (newCompetitions.length > 0) {
        await db.create(newCompetitions);
    }
    // returning competitions from api
    return competitions;
}

const fetchNewGamesAndWriteToDb = async (competitions) => {

    const currentGames = await db.findElement({}, 0, 100);
    await Promise.all(competitions.map(async (competition) => {
        // get leagues including seasons
        let url, params;
        url = `https://soccer.sportmonks.com/api/v2.0/leagues/${competition.id}`;
        params = "include=seasons"
        // get leagues'seasons
        const { data: { seasons: { data: seasons } } } = await fetchData(url, params);
        const currentSeason = seasons.find((season) => season.is_current_season === true);
        //get fixtures of the last season
        const seasonId = currentSeason.id
        url = `https://soccer.sportmonks.com/api/v2.0/seasons/${seasonId}`
        params = "include=fixtures"
        const { data: { fixtures: { data: _games } } } = await fetchData(url, params);
        await Promise.all(_games.map(async (game) => {
            // 180 call/hour rate limit need to optimize 
            if (!currentGames.find((currentGame) => currentGame.id === game.id)) {
                url = `https://soccer.sportmonks.com/api/v2.0/fixtures/${game.id}`;
                params = "include=localTeam,visitorTeam";
                const { data: {
                    id,
                    league_id,
                    season_id,
                    venue: { data: { name: venueName } },
                    localTeam: { data: { name: team1Name } },
                    visitorTeam: { data: { name: team2Name } },
                    localTeam: { data: { logo_path: team1Logo } },
                    visitorTeam: { data: { logo_path: team2Logo } },
                    time: { starting_at: { date: start } },
                } } = await fetchData(url, params);

                let db = new Db("games");
                await db.create([{
                    id,
                    league_id,
                    season_id,
                    team1Name,
                    team2Name,
                    description: `An amazing game between ${team1Name} and ${team2Name} taking place in the outstanding ${venueName} stadium, make your bets ! and may the odds be with you !`,
                    team1Logo,
                    team2Logo,
                    start: Date.parse(start),
                    team1Score: 0,
                    team2Score: 0,
                    winner: 0,
                    ended: false,
                    started: false,
                }]);
            }
        }))

    }))



}

module.exports = { fetchNewCompetitionsAndWriteToDb, fetchNewGamesAndWriteToDb }