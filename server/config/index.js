const CONFIG = {
  DB_NAME: "pokemon_registry",
  CLUSTER_NAME: "cluster0",
  JWT_SECRET: "funckingBeach",
  DB_PASSWORD: "lYPgdJCxJvVjnPrI",
  DB_USERNAME: "antoine",
  SERVER_PORT: 8000,
  SERVER_API_KEY: "123",
  CORS: {
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  },
};

module.exports.CONFIG = CONFIG;
