const { frequency } = require('../config')
const { source } = require('./source')

const start = async () => {
  try {
    await source()
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, frequency)
  }
}

module.exports = {
  start
}
