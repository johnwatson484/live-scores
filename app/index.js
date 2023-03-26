const source = require('./source')
const cache = require('./cache')

const main = async () => {
  await cache.start()
  await source.start()
}

process.on(['SIGINT', 'SIGTERM'], async () => {
  await cache.stop()
  process.exit()
})

main()
