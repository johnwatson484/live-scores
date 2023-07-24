const { By } = require('selenium-webdriver')
const { isLetter } = require('../utils/is-letter')
const { getGoals } = require('./get-goals')

const getMatches = async (matchElements, date, competition) => {
  const matches = []
  for (const matchElement of matchElements) {
    try {
      const homeScore = await matchElement.findElement(By.className('sp-c-fixture__number--home')).getText()
      const awayScore = await matchElement.findElement(By.className('sp-c-fixture__number--away')).getText()

      // If match postponed or abandoned then ignore
      if (isLetter(homeScore[0])) {
        continue
      }

      const homeTeam = await matchElement.findElement(By.className('sp-c-fixture__team-name--home'))?.findElement(By.css('abbr')).getAttribute('title')
      const awayTeam = await matchElement.findElement(By.className('sp-c-fixture__team-name--away'))?.findElement(By.css('abbr')).getAttribute('title')

      const match = {
        date,
        competition,
        homeTeam,
        awayTeam,
        homeScore,
        awayScore
      }

      match.goals = await getGoals(matchElement, homeTeam, awayTeam)

      matches.push(match)
    } catch (err) {
      console.log(err)
    }
  }
  return matches
}

module.exports = {
  getMatches
}
