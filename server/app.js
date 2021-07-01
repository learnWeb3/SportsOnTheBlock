const express = require("express");
const cors = require("cors");
const { CONFIG } = require("./config");
const fs = require("fs");
const { Db } = require("./db");
const { apiKeyCheck } = require("./middlewares");

// init express server
const app = express();
// cors configuration middleware
app.use(cors(CONFIG.CORS));
// api key check middleware
app.use(apiKeyCheck);

app.get("/games/:game_contract_address", async (req, res) => {
  try {
    const { game_contract_address } = req.params;
    if (game_contract_address) {
      const db = new Db("games");
      const game = db.findElement({ address: game_contract_address }, 0, 1);
      if (game.length > 0) {
        const image = fs.readFileSync(`${process.cwd() + game.cover}`);
        res.append("Content-type", "image/png");
        res.send(image);
      } else {
        res.status(404).json({
          message: "Page not found",
        });
      }
    } else {
      res.status(404).json({
        message: "Page not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Forbidden",
    });
  }
});

app.post("/games", async (req, res) => {
  try {
    const { address, cover } = req.body;
    if (address && cover) {
      const db = new Db("games");
      db.create([{ address, cover }]);
      const game = db.findElement({ address }, 0, 1);
      return res.status(200).json(game[0]);
    } else {
      res.status(422).json({
        message: "Unprocessable entity",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Forbidden",
    });
  }
});

// match allroutes not taken in charge by the api
app.all("*", async (req, res) => {
  res.status(404).json({
    message: "Page not found",
  });
});

// lauch server
app.listen(CONFIG.SERVER_PORT, async () =>
  console.log(`server running on port ${CONFIG.SERVER_PORT}`)
);
