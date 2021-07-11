const { Db } = require("../db/index.js");
const fetch = require("node-fetch");
const { api_token } = require("../config/index.json");

const fetchData = async (url, params) =>
  await fetch(url + `?api_token=${api_token}&${params}`).then((data) =>
    data.json()
  );

const fetchNewCompetitionsAndWriteToDb = async () => {
  // instantiating db on competitions collection
  let db = new Db("competitions");
  // retrieving currrent competitions
  const currentCompetitions = await db.findElement({}, 0, 100);
  // fetching competitions aka leagues on API
  const url = "https://soccer.sportmonks.com/api/v2.0/leagues";
  const { data: competitions, error } = await fetchData(url);
  if (!error) {
    const newCompetitions = [];
    // formatting resutls and writing new entires into db
    competitions.map(({ id, name, logo_path: cover }) => {
      if (
        !currentCompetitions.find(
          (currentCompetition) => currentCompetition.id === id
        )
      ) {
        newCompetitions.push({
          id,
          name,
          description: null,
          cover,
          available: true,
        });
      }
    });
    if (newCompetitions.length > 0) {
      await db.create(newCompetitions);
    }
    // returning competitions from api
    return competitions;
  } else {
    throw new Error("API request limit reached");
  }
};

const fetchNewGamesAndWriteToDb = async (competitions) => {
  // instantiating db on games collection
  let db = new Db("games");
  const currentGames = await db.findElement({}, 0, 1000).then((_currentGames) =>
    _currentGames.map((currentGame) => ({
      ...currentGame,
      id: parseInt(currentGame.id),
    }))
  );
  await Promise.all(
    competitions.map(async (competition) => {
      // get leagues including seasons
      let url, params;
      url = `https://soccer.sportmonks.com/api/v2.0/leagues/${competition.id}`;
      params = "include=seasons";
      // get leagues'seasons
      const {
        data: {
          seasons: { data: seasons },
        },
      } = await fetchData(url, params);
      const currentSeason = seasons.find(
        (season) => season.is_current_season === true
      );
      //get fixtures of the last season
      const seasonId = currentSeason.id;
      url = `https://soccer.sportmonks.com/api/v2.0/seasons/${seasonId}`;
      params = "include=fixtures";
      const {
        data: {
          fixtures: { data: _games },
        },
      } = await fetchData(url, params);
      await Promise.all(
        _games.map(async (game) => {
          // 180 call/hour rate limit checking if entry already started and already exists in own db
          if (
            !currentGames.find(
              (currentGame) => currentGame.id === parseInt(game.id)
            ) &&
            game.time.status === "NS"
          ) {
            url = `https://soccer.sportmonks.com/api/v2.0/fixtures/${game.id}`;
            console.log(url);
            params = "include=localTeam,visitorTeam,venue";
            const { data, error } = await fetchData(url, params);
            if (!error) {
              const {
                id,
                league_id,
                season_id,
                venue: {
                  data: { name: venueName },
                },
                localTeam: {
                  data: { name: team1Name },
                },
                visitorTeam: {
                  data: { name: team2Name },
                },
                localTeam: {
                  data: { logo_path: team1Logo },
                },
                visitorTeam: {
                  data: { logo_path: team2Logo },
                },
                time: {
                  starting_at: { date: start },
                },
              } = data;
              await db.create([
                {
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
                },
              ]);
            } else {
              throw new Error("API request limit reached");
            }
          }
        })
      );
    })
  );
};

module.exports = {
  fetchNewCompetitionsAndWriteToDb,
  fetchNewGamesAndWriteToDb,
};
