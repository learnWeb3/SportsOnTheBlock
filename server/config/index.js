const CONFIG = {
  SERVER_PORT: 8000,
  CORS: {
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  },
  GAS: 250000
};

module.exports.CONFIG = CONFIG;
