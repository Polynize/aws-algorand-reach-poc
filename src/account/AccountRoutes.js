const AccountService = require('./AccountService')

async function getAccount ({ req }) {
  const phrase = req?.body?.phrase ?? ''
  return await AccountService.getAccount({ phrase })
}

async function getBalance ({ req }) {
  const phrase = req?.body?.phrase ?? ''
  const response = await AccountService.getAccount({ phrase })
  if (!response.success) return response
  const acc = response.data.acc
  return await AccountService.getBalance({ acc })
}

module.exports = {
  getAccount,
  getBalance
}
