/* eslint-env jest */
const secrets = require('../secrets.js')
const request = require('supertest')

describe('Routes', () => {
  const Routes = require('./Routes')
  const server = Routes.Initialize()

  beforeAll(async () => { })

  describe('GetAccount', () => {
    it('should fail to get account details for blank phrase', async () => {
      const response = await request(server).post('/account/phrase/basic').send({ phrase: '' })
      expect(response.body.success).toBe(false)
    })
    it('should fail to get account details for invalid account', async () => {
      const response = await request(server).post('/account/phrase/basic').send({ phrase: 'chef daughter double' })
      expect(response.body.success).toBe(false)
    })
    it('should get account details', async () => {
      const response = await request(server).post('/account/phrase/basic').send({ phrase: secrets.ALICE_ACCOUNT_PHRASE })
      expect(response.body.data.address).toBe(secrets.ALICE_ADDRESS)
    })
  })

  describe('GetBalance', () => {
    it('should fail to get account details for blank phrase', async () => {
      const response = await request(server).post('/account/phrase/balance').send({ phrase: '' })
      expect(response.body.success).toBe(false)
    })
    it('should fail to get account details for invalid account', async () => {
      const response = await request(server).post('/account/phrase/balance').send({ phrase: 'chef daughter double' })
      expect(response.body.success).toBe(false)
    })
    it('should get account balance', async () => {
      const response = await request(server).post('/account/phrase/balance').send({ phrase: secrets.ALICE_ACCOUNT_PHRASE })
      expect(response.body.data.balance).toBeGreaterThanOrEqual(0)
    })
  })
})