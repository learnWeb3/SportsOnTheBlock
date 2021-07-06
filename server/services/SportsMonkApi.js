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
    competitions.map((competition) => {
        if (!currentCompetitions.find((competition) => competition.id)) {
            newCompetitions.push(competition)
        }
    })
    await db.create(newCompetitions);
    return competitions;
}

const fetchNewGamesAndWriteToDb = async (competitions) => {

    const games = [];

    await Promise.all(competitions.map(async (competition) => {
        // get leagues
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
            url = `https://soccer.sportmonks.com/api/v2.0/fixtures/${game.id}`;
            params = "include=localTeam,visitorTeam";
            const { data } = await fetchData(url, params);
            console.log(data)
            games.push(data);

        }))

    }))
    let db = new Db("games");
    const currentGames = await db.findElement({}, 0, 100);
    const newGames = [];
    games.map((game) => {
        if (!currentGames.find((game) => game.id)) {
            newGames.push(game)
        }
    })
    await db.create(newGames);
    return games

}

module.exports = { fetchNewCompetitionsAndWriteToDb, fetchNewGamesAndWriteToDb }