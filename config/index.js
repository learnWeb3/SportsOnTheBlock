const CONFIG = {
  development: {
    provider_url: "http://localhost:8545",
    server_root_path: "http://localhost:8000",
    mnemonic:
      "surge furnace seek amazing abuse crop orbit slow congress volcano buzz arm",
  },
  production: {
    provider_url:
      "https://ropsten.infura.io/v3/4c45f4cc5b5b450e8a17ddae01994d56",
    mnemonic:
      "surge furnace seek amazing abuse crop orbit slow congress volcano buzz arm",
    server_root_path: "http://localhost:8000",
  },
  api_token: "oZ8wj1OkApK3z1uNekBiOVkzdi8wT5o8hZXfzmejHHzAcwVVLdaJMs2QXUoi"
};

module.exports = { CONFIG };
