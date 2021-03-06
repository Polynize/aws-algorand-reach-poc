const reach = require('../utils/Reach').getReach()

// Funding only possible on devnet and maybe testnet?
// See https://docs.reach.sh/ref-usage.html  (reach devnet)
// Note amount of 1 is 1 million (1,000,000 MicroAlgo)
async function transfer ({ fromAcc, toAcc, amount }) {
  try {
    const amountInCurrency = reach.parseCurrency(amount)
    if (!fromAcc || !toAcc) {
      console.log('FundAccount failed, invalid account')
      return false
    }
    await reach.transfer(fromAcc, toAcc, amountInCurrency)
  } catch (err) {
    console.log('FundAccount failed', err)
    return false
  }
  return true
}

async function getAccount ({ phrase }) {
  let acc = null
  try {
    if (!phrase || phrase === '') {
      console.log('GetAccounts failed, invalid phrase')
      return null
    }
    acc = await reach.newAccountFromMnemonic(phrase)
    // console.log('acc addr', acc?.networkAccount?.addr)
  } catch (err) {
    console.log('GetAccounts failed', err)
  }
  return acc
}

// Funding only possible on devnet and maybe testnet?
// See https://docs.reach.sh/ref-usage.html  (reach devnet)
// Note amount of 1 is 1 million (1,000,000 MicroAlgo)
async function fundAccount ({ acc, amount }) {
  try {
    const amountInCurrency = reach.parseCurrency(amount)
    if (!acc) {
      console.log('FundAccount failed, invalid account')
      return false
    }
    await reach.fundFromFaucet(acc, amountInCurrency)
  } catch (err) {
    console.log('FundAccount failed', err)
    return false
  }
  return true
}

async function getBalanceAsString ({ acc }) {
  const fmt = (x) => reach.formatCurrency(x, 4)
  const balance = await reach.balanceOf(acc)
  return fmt(balance)
}

async function getBalance ({ acc }) {
  try {
    const balanceStr = await getBalanceAsString({ acc })
    console.log('acc addr', acc?.networkAccount?.addr, 'balance', balanceStr)
    return parseFloat(balanceStr)
  } catch (err) {
    console.log('Failed to parse balance.')
  }
  return -1
}

module.exports = {
  transfer,
  getAccount,
  fundAccount,
  getBalance
}
