const { start: startCache, stop: stopCache } = require('./cache')
const { start: startSource } = require('./source')

const main = async () => {
  await startCache()
  await startSource()
}

process.on(['SIGINT', 'SIGTERM'], async () => {
  await stopCache()
  process.exit()
})

main()
