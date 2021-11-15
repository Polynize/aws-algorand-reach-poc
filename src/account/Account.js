const reach = require('./Reach').configure()

async function getAccount ({ phrase }) {
  let acc = null
  try {
    if (!phrase || phrase === '') {
      console.log('GetAccounts failed, invalid phrase')
      return null
    }
    acc = await reach.newAccountFromMnemonic(phrase)
  } catch (err) {
    console.log('GetAccounts failed', err)
  }
  return acc
}

async function getBalanceAsString ({ acc }) {
  const fmt = (x) => reach.formatCurrency(x, 4)
  const balance = await reach.balanceOf(acc)
  return fmt(balance)
}

async function getBalance ({ acc }) {
  try {
    const balanceStr = await getBalanceAsString({ acc })
    return parseFloat(balanceStr)
  } catch (err) {
    console.log('Failed to parse balance.')
  }
  return -1
}

module.exports = {
  getAccount,
  getBalance
}
