const { By } = require('selenium-webdriver')
const { getGoalDetails } = require('./get-goals-details')

const getGoals = async (matchElement, homeTeam, awayTeam) => {
  const homeGoalElements = await matchElement.findElement(By.className('sp-c-fixture__scorers-home')).findElements(By.css('li'))
  const awayGoalElements = await matchElement.findElement(By.className('sp-c-fixture__scorers-away')).findElements(By.css('li'))

  const homeGoals = await getGoalDetails(homeGoalElements, homeTeam)
  const awayGoals = await getGoalDetails(awayGoalElements, awayTeam)
  return [...homeGoals, ...awayGoals]
}

module.exports = {
  getGoals
}
