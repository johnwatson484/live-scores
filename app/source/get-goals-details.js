const { By } = require('selenium-webdriver')

const getGoalDetails = async (goalElements, team) => {
  const goals = []
  for (const goalElement of goalElements) {
    const details = await goalElement.findElements(By.xpath('span'))

    const player = await details[0].getText()
    const playerGoals = details.length - 2

    for (let i = 1; i <= playerGoals; i++) {
      const icons = await details[i].findElements(By.css('img'))
      // If icon exists then was red card not goal
      if (icons.length) {
        continue
      }

      const incidentElements = await details[i].findElements(By.css('span'))

      const minute = (await incidentElements[0].getText()).replace(/['()]/g, '').split('+')[0]
      const ownGoal = (await incidentElements[0].getText()).includes('og')

      const goal = {
        team,
        player,
        minute,
        ownGoal
      }

      goals.push(goal)
    }
  }
  return goals
}

module.exports = {
  getGoalDetails
}
