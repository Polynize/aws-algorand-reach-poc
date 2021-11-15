const express = require('express')
const cors = require('cors')

// Seperate API routes from business logic
const AlgoRoutes = require('../account/AccountRoutes')

// Must pass back an object
// Must include { success: true | false } at minimum.
// See ret.js for more details.
const ret = require('./ret').ret

module.exports.Initialize = function () {
  const server = express()
  server.use(cors())
  server.use(express.json())

  // # Account
  // Get account details from phrase
  server.post('/account/phrase/basic', async (req, res) => await ret({ res, req, func: AlgoRoutes.getAccount }))
  // Get balance details from phrase
  server.post('/account/phrase/balance', async (req, res) => await ret({ res, req, func: AlgoRoutes.getBalance }))

  // Must be after all other routes.
  // Catch all
  server.use((req, res, next) => { return res.status(404).json({ error: 'Not Found' }) })

  return server
}
