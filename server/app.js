const express = require("express");
const cors = require("cors");
const { CONFIG } = require("./config");
const fs = require("fs");
// init express server
const app = express();
// cors configuration middleware
app.use(cors(CONFIG.CORS));

app.use("/games", express.static("./public/games"));
app.use("/competitions", express.static("./public/competitions"));

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
