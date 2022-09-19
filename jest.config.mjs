/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  extensionsToTreatAsEsm: [".ts"],
  preset: "ts-jest/presets/default-esm-legacy",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/**/*.{ts,tsx}"],
  coverageDirectory: "coverage",

  rootDir: "./src",

  testEnvironment: "node",
};
