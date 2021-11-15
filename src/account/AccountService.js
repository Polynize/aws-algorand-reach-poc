const Account = require('./Account.js')

async function getAccount ({ phrase }) {
  try {
    if (!phrase || phrase === '') return { success: false, error: 'Invalid phrase to retrieve account' }
    const acc = await Account.getAccount({ phrase })
    if (!acc) return { success: false, error: 'Unable to retrieve account' }
    return { success: true, data: { acc, address: acc.networkAccount.addr } }
  } catch (err) {
    console.log('Failed to run', err)
  }
  return { success: false }
}

async function getBalance ({ acc }) {
  try {
    if (!acc) return { success: false, error: 'Unable to retrieve account' }
    const balance = await Account.getBalance({ acc })
    return { success: true, data: { address: acc.networkAccount.addr, balance } }
  } catch (err) {
    console.log('Failed to run', err)
  }
  return { success: false }
}

module.exports = {
  getAccount,
  getBalance
}
