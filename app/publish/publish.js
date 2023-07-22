const amqp = require('amqplib')
const { message } = require('../config')

const publish = async (scores) => {
  const { host, port, username, password, exchange } = message
  const connection = await amqp.connect(`amqp://${username}:${password}@${host}:${port}`)
  const channel = await connection.createChannel()
  await channel.assertExchange(exchange, 'fanout', {
    durable: true
  })

  for (const score of scores) {
    const body = JSON.stringify(score)
    await channel.publish(exchange, '', Buffer.from(body))
    console.log('Score update:', body)
  }
  await channel.close()
  await connection.close()
}

module.exports = {
  publish
}
