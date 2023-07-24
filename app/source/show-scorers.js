const { By, until } = require('selenium-webdriver')

const showScorers = async (driver) => {
  await driver.wait(until.elementLocated(By.css('.qa-match-block')), 2000)
  await driver.wait(until.elementLocated(By.css('.qa-show-scorers-button')), 10000)
  await driver.wait(until.elementIsEnabled(driver.findElement(By.css('.qa-show-scorers-button'))), 10000)
  await driver.findElement(By.css('.qa-show-scorers-button')).click()
  await driver.wait(until.elementLocated(By.css('.qa-match-block')), 2000)
}

module.exports = {
  showScorers
}
