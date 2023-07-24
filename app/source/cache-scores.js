const { update } = require('../cache')

const cacheScores = async (scores) => {
  for (const match of scores) {
    const key = `${match.date}-${match.competition}-${match.homeTeam}-${match.awayTeam}`
    await update('live-scores', key, match)
  }
}

module.exports = {
  cacheScores
}
