module.exports = {
  verbose: true,
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"
  },
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 70,
      lines: 70,
      statements: -20
    }
  }
}