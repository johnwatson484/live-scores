const { frequency } = require('./config')

const start = async () => {
  try {
    await source()
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, frequency)
  }
}

const source = async () => {
  console.log('Publishing...')
}

module.exports = {
  start
}
