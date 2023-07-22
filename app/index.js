const { start: startCache, stop: stopCache } = require('./cache')
const { source: startSource } = require('./source')
const { SIGINT, SIGTERM } = require('./constants/signals')

const main = async () => {
  await startCache()
  await startSource()
}

process.on([SIGINT, SIGTERM], async () => {
  await stopCache()
  process.exit()
})

main()
