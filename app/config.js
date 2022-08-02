const joi = require('joi')
const envs = ['development', 'test', 'production']

// Define config schema
const schema = joi.object().keys({
  env: joi.string().valid(...envs).default(envs[0]),
  appName: joi.string()
})

// Build config
const config = {
  env: process.env.NODE_ENV
}

// Validate config
const { error, value } = schema.validate(config)

// Throw if config is invalid
if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

value.isDev = value.env === 'development'

module.exports = value
