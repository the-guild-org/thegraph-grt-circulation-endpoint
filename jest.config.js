module.exports = {
  modulePathIgnorePatterns: ["/dist/"],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
};
