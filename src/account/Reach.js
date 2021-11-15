const loadStdlib = require('@reach-sh/stdlib').loadStdlib

let reach = null

function configure () {
  if (reach) return reach
  // Connect to the TestNet node
  const PROVIDER = 'TestNet'
  const args = { ...process.env, REACH_CONNECTOR_MODE: 'ALGO', PROVIDER: 'TestNet' }
  reach = loadStdlib(args)
  reach.setProviderByName(PROVIDER)
  return reach
}

module.exports = {
  configure
}
