module.exports = {
  "plugins": [
    "babel-plugin-transform-typescript-metadata",
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ],
    "@babel/plugin-transform-modules-commonjs",
    "babel-plugin-superjson-next",
  ],
  "presets": [
    "next/babel"
  ]
}
