const loadStdlib = require('@reach-sh/stdlib').loadStdlib

const REACH_CONNECTOR_MODES = {
  ALGO: 'ALGO'
}

const PROVIDERS = {
  MainNet: 'MainNet',
  TestNet: 'TestNet',
  LocalHost: 'LocalHost'
}

// See https://docs.reach.sh/ref-usage.html
// Set to ALGO for testnet
const REACH_CONNECTOR_MODE = REACH_CONNECTOR_MODES.ALGO
const PROVIDER = PROVIDERS.TestNet // Set this to connect to another network.

let reach = null

function getReach () {
  // Singleton
  if (reach) {
    return reach
  }
  // console.log('Create reach connection to ', REACH_CONNECTOR_MODE, 'Provider', PROVIDER)
  reach = loadStdlib({ ...process.env, REACH_CONNECTOR_MODE })
  reach.setProviderByName(PROVIDER)
  return reach
}

module.exports = {
  getReach
}
