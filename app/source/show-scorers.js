const { By, until } = require('selenium-webdriver')

const showScorers = async (driver) => {
  await driver.wait(until.elementLocated(By.css('.ssrcss-1jkg1a7-HeaderWrapper')), 2000)
  await driver.wait(until.elementLocated(By.xpath('//button[text()="Show Scorers"]')), 10000)
  await driver.wait(until.elementIsEnabled(driver.findElement(By.css('.ssrcss-40uire-Button'))), 10000)
  const button = await driver.findElement(By.xpath('//button[text()="Show Scorers"]'))// .click()
  await driver.executeScript('arguments[0].click();', button)
  await driver.wait(until.elementLocated(By.css('.ssrcss-1jkg1a7-HeaderWrapper')), 2000)
}

module.exports = {
  showScorers
}
