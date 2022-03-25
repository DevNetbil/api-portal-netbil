module.exports = {
  apps: [
    {
      // we load the common config
      // eslint-disable-next-line global-require
      ...require("./pm2.config"),
      // we set environment variables
      env: {
        PORT: 8555,
        NODE_ENV: "production",
      },
    },
  ],
};
