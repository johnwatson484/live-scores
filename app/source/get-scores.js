const { Builder, Browser, By } = require('selenium-webdriver')
const { Options } = require('selenium-webdriver/chrome')
const moment = require('moment')
const { endpoint } = require('../config')
const competitions = require('../constants/competitions')
const { showScorers } = require('./show-scorers')
const { closeModal } = require('./close-modal')
const { getMatches } = require('./get-matches')

const getScores = async () => {
  const options = new Options()
  options.addArguments('no-sandbox')
  options.addArguments('disable-dev-shm-usage')
  options.addArguments('headless')
  options.addArguments('disable-gpu')
  options.addArguments('user-data-dir=/tmp/google-chrome')
  options.addArguments('remote-debugging-port=9222')
  const driver = new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()

  try {
    const date = moment().format('YYYY-MM-DD')
    await driver.get(`${endpoint}/${date}`)

    try {
      await showScorers(driver)
    } catch (err) {
      if (err.name === 'ElementClickInterceptedError') {
        await closeModal(driver)
        await showScorers(driver)
      }
    }

    const scores = []

    const competitionElements = await driver.findElements(By.className('qa-match-block'))
    for (const competitionElement of competitionElements) {
      const competitionName = await competitionElement.findElement(By.css('h3')).getText()
      const matchedCompetition = Object.values(competitions).find(x => x.toUpperCase() === competitionName?.toUpperCase())
      if (matchedCompetition) {
        const matchElements = await competitionElement.findElements(By.className('gs-o-list-ui__item'))
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
