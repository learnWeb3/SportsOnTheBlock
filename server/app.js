const express = require("express");
const cors = require("cors");
const { CONFIG } = require("./config");
const fs = require("fs");
// init express server
const app = express();
// cors configuration middleware
app.use(cors(CONFIG.CORS));

app.get("/games/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const image = fs.readFileSync(`${process.cwd()}/public/games/${id}.png`);
      res.append("Content-type", "image/png");
      res.send(image);
    } else {
      res.status(422).json({
        message: "id must be present",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Forbidden",
    });
  }
});

app.get("/competitions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const image = fs.readFileSync(
        `${process.cwd()}/public/competitions/${id}.png`
      );
      res.append("Content-type", "image/png");
      res.send(image);
    } else {
      res.status(422).json({
        message: "id must be present",
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
