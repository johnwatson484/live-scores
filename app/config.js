const Joi = require('joi')
const { DEVELOPMENT, TEST, PRODUCTION } = require('./constants/environments')

const schema = Joi.object().keys({
  env: Joi.string().valid(DEVELOPMENT, TEST, PRODUCTION).default(DEVELOPMENT),
  endpoint: Joi.string().uri().default('https://www.bbc.com/sport/football/scores-fixtures/'),
  cache: Joi.object({
    socket: Joi.object({
      host: Joi.string(),
      port: Joi.number().default(6379),
      tls: Joi.boolean().default(false)
    }),
    password: Joi.string().allow(''),
    partition: Joi.string().default('live-scores-publisher'),
    ttl: Joi.number().default(2592000) // 30 days
  }),
  message: Joi.object({
    host: Joi.string(),
    port: Joi.number().default(5672),
    username: Joi.string(),
    password: Joi.string(),
    exchange: Joi.string().default('live-scores')
  }),
  frequency: Joi.number().default(10000) // 10 seconds
})

const config = {
  env: process.env.NODE_ENV,
  endpoint: process.env.ENDPOINT,
  cache: {
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      tls: process.env.REDIS_TLS
    },
    password: process.env.REDIS_PASSWORD,
    partition: process.env.REDIS_PARTITION,
    ttl: process.env.REDIS_TTL
  },
  message: {
    host: process.env.MESSAGE_HOST,
    port: process.env.MESSAGE_PORT,
    username: process.env.MESSAGE_USERNAME,
    password: process.env.MESSAGE_PASSWORD,
    exchange: process.env.MESSAGE_EXCHANGE
  },
  frequency: process.env.FREQUENCY
}

const { error, value } = schema.validate(config)

if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

value.isDev = value.env === DEVELOPMENT

module.exports = value
