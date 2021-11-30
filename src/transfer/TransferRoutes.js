const secrets = require('../secrets.js')
const reach = require('../utils/Reach').getReach()
const TransferService = require('./TransferService')
const getAccount = require('../account/Account').getAccount
const fundAccount = require('../account/Account').fundAccount
const getBalance = require('../account/Account').getBalance

async function transfer ({ req }) {
  const phrasePlatform = secrets.PLATFORM_ACCOUNT_PHRASE ?? ''
  const phraseSender = req?.body?.phraseSender ?? ''
  const phraseReceiver = req?.body?.phraseReceiver ?? ''
  const transferAmount = req?.body?.transferAmount ?? 2
  const fundOnDevnet = req?.body?.fundOnDevnet ?? false

  const accPlatform = await getAccount({ phrase: phrasePlatform })
  const accSender = await getAccount({ phrase: phraseSender })
  const accReceiver = await getAccount({ phrase: phraseReceiver })

  // For testing, fund the accounts.
  if (fundOnDevnet) {
    if (reach.canFundFromFaucet()) {
      const senderBalance = await getBalance({ acc: accSender })
      const receiverBalance = await getBalance({ acc: accReceiver })
      // console.log('Need to fund accounts? senderBalance', senderBalance, 'transferAmount', transferAmount, 'receiverBalance', receiverBalance)
      if (senderBalance < transferAmount || receiverBalance < TransferService.PLATFORM_FEE) {
        console.log('Attempt to fund accounts... senderBalance', senderBalance, '< transferAmount', transferAmount)
        await Promise.all([
          fundAccount({ acc: accPlatform, amount: 10 }),
          fundAccount({ acc: accSender, amount: 10 }),
          fundAccount({ acc: accReceiver, amount: 10 })
        ])
      }
    } else {
      return { success: false, error: 'Unable to fund accounts from Faucet.' }
    }
  }

  return await TransferService.transfer({ accPlatform, accSender, accReceiver, transferAmount })
}

module.exports = {
  transfer
}
