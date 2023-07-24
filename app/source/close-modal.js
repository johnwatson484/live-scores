const { By, until } = require('selenium-webdriver')

const closeModal = async (driver) => {
  const iframe = await driver.findElement(By.xpath('//iframe[@title="SP Consent Message"]'))
  await driver.switchTo().frame(iframe)
  await driver.wait(until.elementLocated(By.xpath('//button[@title="I agree"]')), 10000)
  await driver.findElement(By.xpath('//button[@title="I agree"]')).click()
  await driver.switchTo().defaultContent()
}

module.exports = {
  closeModal
}
