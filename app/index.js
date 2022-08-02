const source = require('./source')
const cache = require('./cache')

const main = async () => {
  await cache.start()
  await source.start()
}

for (const signal of ['SIGINT', 'SIGTERM', 'SIGQUIT']) {
  process.on(signal, async () => {
    await cache.stop()
    process.exit()
  })
}

main()
