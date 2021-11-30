/* eslint-env jest */
const secrets = require('../secrets.js')
const request = require('supertest')

describe('Routes', () => {
  const Routes = require('./Routes')
  const server = Routes.Initialize()

  beforeAll(async () => { })

  describe('Reach Programs', () => {
    describe('Transfer', () => {
      it('Should transfer funds from Alice to Bob', async () => {
        const response = await request(server).post('/contract/transfer/platform').send({ fundOnDevnet: true, phraseSender: secrets.ALICE_ACCOUNT_PHRASE, phraseReceiver: secrets.BOB_ACCOUNT_PHRASE })
        console.log('response.body', response.body)
        expect(response.body.success).toBe(true)
      })
    })
  })

  /*
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
      expect(response.body.success).toBe(true)
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
  }) */
})
