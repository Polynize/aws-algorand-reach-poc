/**
 * AWS entry point for app. See serverless.yaml "functions.api.handler"
 */
const serverless = require('serverless-http')
const Routes = require('./src/routes/Routes')
const app = Routes.Initialize()

module.exports.handler = serverless(app)
