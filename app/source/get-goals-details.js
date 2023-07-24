const { By } = require('selenium-webdriver')

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

module.exports = {
  getGoalDetails
}
