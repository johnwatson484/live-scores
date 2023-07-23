const { Builder, Browser, By, until } = require('selenium-webdriver')
const { Options } = require('selenium-webdriver/chrome')
const moment = require('moment')
const { endpoint } = require('../config')
const competitions = require('../constants/competitions')
const { update } = require('../cache')
const { publish } = require('../publish')

const source = async () => {
  console.log('Acquiring live scores...')
  const scores = await getScores()
  console.log('Caching scores...')
  await cacheScores(scores)
  console.log('Publishing scores...')
  await publish(scores)
  console.log('Completed')
}

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
      if (Object.values(competitions).includes(competitionName?.toUpperCase())) {
        const matchElements = await competitionElement.findElements(By.className('gs-o-list-ui__item'))
        const competitionScores = await getMatches(matchElements, date, competitionName)
        scores.push(...competitionScores)
      }
    }
    return scores
  } finally {
    await driver.quit()
  }
}

const cacheScores = async (scores) => {
  for (const match of scores) {
    const key = `${match.date}-${match.competition}-${match.homeTeam}-${match.awayTeam}`
    await update('live-scores', key, match)
  }
}

const showScorers = async (driver) => {
  await driver.wait(until.elementLocated(By.css('.qa-match-block')), 2000)
  await driver.wait(until.elementLocated(By.css('.qa-show-scorers-button')), 10000)
  await driver.wait(until.elementIsEnabled(driver.findElement(By.css('.qa-show-scorers-button'))), 10000)
  await driver.findElement(By.css('.qa-show-scorers-button')).click()
  await driver.wait(until.elementLocated(By.css('.qa-match-block')), 2000)
}

const closeModal = async (driver) => {
  await driver.wait(until.elementLocated(By.id('bbccookies-continue-button')), 10000)
  await driver.findElement(By.id('bbccookies-continue-button')).click()
}

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

const getGoals = async (matchElement, homeTeam, awayTeam) => {
  const homeGoalElements = await matchElement.findElement(By.className('sp-c-fixture__scorers-home')).findElements(By.css('li'))
  const awayGoalElements = await matchElement.findElement(By.className('sp-c-fixture__scorers-away')).findElements(By.css('li'))

  const homeGoals = await getGoalDetails(homeGoalElements, homeTeam)
  const awayGoals = await getGoalDetails(awayGoalElements, awayTeam)
  return [...homeGoals, ...awayGoals]
}

const getGoalDetails = async (goalElements, team) => {
  const goals = []
  for (const goalElement of goalElements) {
    const details = await goalElement.findElements(By.xpath('span'))

    const player = await details[0].getText()
    const playerGoals = Math.ceil((details.length - 4) / 2)

    let y = 2
    for (let i = 0; i < playerGoals; i++) {
      const icons = await details[y].findElements(By.css('i'))
      // If icon exists then was red card not goal
      if (icons.length) {
        continue
      }

      const incidentElements = await details[y].findElements(By.css('span'))

      const minute = (await incidentElements[0].getText()).replace('\'', '').split('+')[0]
      const ownGoal = (await incidentElements[2].getText())?.replace(' ', '') === 'og'

      const goal = {
        team,
        player,
        minute,
        ownGoal
      }

      goals.push(goal)
      y += 2
    }
  }
  return goals
}

const isLetter = (str) => {
  return str.length === 1 && str.match(/[a-z]/i)
}

module.exports = {
  source
}
