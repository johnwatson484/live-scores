const { frequency } = require('./config')

const start = async () => {
  try {
    await publish()
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, frequency)
  }
}

const publish = async () => {
  console.log('Publishing...')
}

module.exports = {
  start
}
