const { client } = require('./client')

const stop = async () => {
  if (client.isOpen) {
    await client.quit()
  }
}

module.exports = {
  stop
}
