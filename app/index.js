const publish = require('./publish')
const cache = require('./cache')

const main = async () => {
  await cache.start()
  await publish.start()
}

for (const signal of ['SIGINT', 'SIGTERM', 'SIGQUIT']) {
  process.on(signal, async () => {
    await cache.stop()
    process.exit()
  })
}

main()
