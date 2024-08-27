const { By } = require('selenium-webdriver')
const { isLetter } = require('../utils/is-letter')
const { getGoals } = require('./get-goals')

const getMatches = async (matchElements, date, competition) => {
  const matches = []
  for (const matchElement of matchElements) {
    try {
      const kickOffTime = await matchElement.findElements(By.css('time'))

      if (kickOffTime.length) {
        // if kick off time is showing then match has not started
        continue
      }

      const homeScore = await matchElement.findElement(By.className('ssrcss-qsbptj-HomeScore')).getText()
      const awayScore = await matchElement.findElement(By.className('ssrcss-fri5a2-AwayScore')).getText()

      // If match postponed or abandoned then ignore
      if (isLetter(homeScore[0])) {
        continue
      }

      const homeTeam = await matchElement.findElement(By.className('ssrcss-93qnvo-StyledTeam-HomeTeam'))?.findElement(By.css('.ssrcss-nszz2y-TeamNameWrapper')).findElement(By.css('span')).getText()
      const awayTeam = await matchElement.findElement(By.className('ssrcss-19knk4k-StyledTeam-AwayTeam'))?.findElement(By.css('.ssrcss-nszz2y-TeamNameWrapper')).findElement(By.css('span')).getText()

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
