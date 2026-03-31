const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Cette partie est la clé :
  moduleNameMapper: {
    // Si un import finit par .js, on lui dit de chercher le fichier sans le .js
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
