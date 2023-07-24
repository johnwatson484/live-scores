const { publish } = require('../publish')
const { getScores } = require('./get-scores')
const { cacheScores } = require('./cache-scores')

const source = async () => {
  console.log('Acquiring live scores...')
  const scores = await getScores()
  console.log('Caching scores...')
  await cacheScores(scores)
  console.log('Publishing scores...')
  await publish(scores)
  console.log('Completed')
}

module.exports = {
  source
}
