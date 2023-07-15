const { cache: config } = require('../config')
const { getFullKey } = require('./get-full-key')
const { client } = require('./client')

const set = async (cache, key, value) => {
  const fullKey = getFullKey(cache, key)
  const serializedValue = JSON.stringify(value)
  await client.set(fullKey, serializedValue, { EX: config.ttl })
}

module.exports = {
  set
}
