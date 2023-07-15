const { createClient } = require('redis')
const { cache: config } = require('../config')
let { client } = require('./client')

const start = async () => {
  client = createClient({ socket: config.socket, password: config.password })
  client.on('error', (err) => console.log(`Redis error: ${err}`))
  client.on('reconnecting', () => console.log('Redis reconnecting...'))
  client.on('ready', () => console.log('Redis connected'))
  await client.connect()
}

module.exports = {
  start
}
