const { CONFIG } = require("../config");

const apiKeyCheck = (err, req, res, next) => {
  const { api_key } = req.params;
  if (api_key) {
    if (api_key === CONFIG.SERVER_API_KEY) {
      next();
    } else {
      res.status(401).json({
        message: "Unauthorized, invalid API key",
      });
    }
  } else {
    res.status(401).json({
      message:
        "Unauthorized, this api require an api key appended to your request parameters such as api_key=XXXXX",
    });
  }
};

module.exports = { apiKeyCheck };
