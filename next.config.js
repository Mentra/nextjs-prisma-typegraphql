/* eslint-disable */

const { NormalModuleReplacementPlugin } = require("webpack")

module.exports = {
  publicRuntimeConfig: {
    API_ENDPOINT: process.env.API_ENDPOINT,
    ENVIRONMENT: process.env.ENVIRONMENT,
  },
  webpack5: true,
  webpack: (config) => {
    config.plugins = config.plugins || [];
    config.plugins.push(
      new NormalModuleReplacementPlugin(/type-graphql$/, resource => {
        resource.request = resource.request.replace(/type-graphql/, "type-graphql/dist/browser-shim.js");
      }),
    );
    return config;
  }
};
