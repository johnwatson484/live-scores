const { Builder, Browser, By } = require('selenium-webdriver')
const { Options } = require('selenium-webdriver/chrome')
const moment = require('moment')
const { endpoint } = require('../config')
const competitions = require('../constants/competitions')
const { showScorers } = require('./show-scorers')
const { getMatches } = require('./get-matches')

const getScores = async () => {
  const options = new Options()
  options.addArguments('no-sandbox')
  options.addArguments('disable-dev-shm-usage')
  options.addArguments('headless')
  options.addArguments('disable-gpu')
  options.addArguments('user-data-dir=/tmp/google-chrome')
  options.addArguments('remote-debugging-port=0')
  const driver = new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()
  await driver.manage().deleteAllCookies()

  try {
    const date = moment().format('YYYY-MM-DD')
    await driver.get(`${endpoint}/${date}`)

    await showScorers(driver)

    const scores = []

    const competitionElements = await driver.findElements(By.className('ssrcss-1jkg1a7-HeaderWrapper'))
    for (const competitionElement of competitionElements) {
      let competitionName
      try {
        competitionName = await competitionElement.findElement(By.css('h2')).getText()
      } catch {
        try {
          competitionName = await competitionElement.findElement(By.css('h3')).getText()
        } catch {
        }
      }
      const matchedCompetition = Object.values(competitions).find(x => x.toUpperCase() === competitionName?.toUpperCase())
      if (matchedCompetition) {
        const matchElements = await competitionElement.findElements(By.className('ssrcss-53e6q1-StyledHeadToHead'))
        const competitionScores = await getMatches(matchElements, date, matchedCompetition)
        scores.push(...competitionScores)
      }
    }
    return scores
  } finally {
    await driver.quit()
  }
}

module.exports = {
  getScores
}
