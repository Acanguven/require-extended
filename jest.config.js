module.exports = {
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  "testMatch": [
    "**/test/*.+(ts|tsx)"
  ],
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js"
  ],
  "collectCoverageFrom": [
    "**/lib/*.+(ts|tsx)"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 100,
      "functions": 100,
      "lines": 100,
      "statements": 100
    }
  }
};
