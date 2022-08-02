const cache = require('./cache')

const main = async () => {
  await cache.start()
  console.log('Sourcing data')
}

for (const signal of ['SIGINT', 'SIGTERM', 'SIGQUIT']) {
  process.on(signal, async () => {
    console.log('Shutting down')
    await cache.stop()
    process.exit()
  })
}

main()
