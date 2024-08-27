const { By } = require('selenium-webdriver')
const { getGoalDetails } = require('./get-goals-details')

const getGoals = async (matchElement, homeTeam, awayTeam) => {
  const homeGoalElements = await (await matchElement.findElements(By.css('.ssrcss-7kpa5o-StyledUl')))[0]?.findElements(By.css('li')) ?? []
  const awayGoalElements = await (await matchElement.findElements(By.css('.ssrcss-1ud7mm0-StyledUl')))[0]?.findElements(By.css('li')) ?? []

  const homeGoals = await getGoalDetails(homeGoalElements, homeTeam)
  const awayGoals = await getGoalDetails(awayGoalElements, awayTeam)
  return [...homeGoals, ...awayGoals]
}

module.exports = {
  getGoals
}
