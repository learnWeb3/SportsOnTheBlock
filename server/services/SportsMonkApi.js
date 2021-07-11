const { Db } = require("../db/index.js");
const fetch = require("node-fetch");
const { api_token } = require("../config/index.json");

const fetchData = async (url, params) =>
  await fetch(url + `?api_token=${api_token}&${params}`).then((data) =>
    data.json()
  );

const getCurrentCompetitions = async () => {
  // instantiating db on competitions collection
  let db = new Db("competitions");
  // retrieving currrent competitions
  return await db.findElement({}, 0, 100);
};

const getCurrentGames = async () => {
  // instantiating db on games collection
  let db = new Db("games");
  // retrieving currrent games
  return await db.findElement({}, 0, 1000).then((_currentGames) =>
    _currentGames.map((currentGame) => ({
      ...currentGame,
      id: parseInt(currentGame.id),
    }))
  );
};

const fetchNewCompetitionsAndWriteToDb = async () => {
  const currentCompetitions = await getCurrentCompetitions();
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

const fetchNewGamesAndWriteToDb = async (competitionsIds) => {
  const currentGames = await getCurrentGames();
  await Promise.all(
    competitionsIds.map(async (competitionId) => {
      // get leagues including seasons
      let url, params;
      url = `https://soccer.sportmonks.com/api/v2.0/leagues/${competitionId}`;
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

      // 180 call/hour rate limit checking if entry has not yet started and does not already exists in own db
      const unregisteredGames = _games.filter(
        (game) =>
          !currentGames.find((currentGame) => currentGame.id) &&
          game.time.status === "NS"
      );

      if (unregisteredGames.length > 0) {
        await Promise.all(
          unregisteredGames.map(async (game) => {
            url = `https://soccer.sportmonks.com/api/v2.0/fixtures/${game.id}`;
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
            }
          })
        );
      }
    })
  );
};

const updateGamesStatus = async () => {
  const currentGames = await getCurrentGames();
  const db = new Db("games");
  await Promise.all(
    currentGames.map(async (currentGame) => {
      if (currentGame.start < Date.now()) {
        await db.update(currentGame, {
          ...currentGame,
          ended: true,
          started: true,
        });
      }
    })
  );
};

module.exports = {
  fetchNewCompetitionsAndWriteToDb,
  fetchNewGamesAndWriteToDb,
  updateGamesStatus,
};
