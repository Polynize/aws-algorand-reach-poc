const secrets = require('../secrets.js')
const reach = require('../utils/Reach').getReach()
const TransferService = require('./TransferService')
const Account = require('../account/Account')

async function transfer ({ req }) {
  const phrasePlatform = secrets.PLATFORM_ACCOUNT_PHRASE ?? ''
  const phraseSender = req?.body?.phraseSender ?? ''
  const phraseReceiver = req?.body?.phraseReceiver ?? ''
  const transferAmount = req?.body?.transferAmount ?? 2
  const fundOnDevnet = req?.body?.fundOnDevnet ?? false

  const accPlatform = await Account.getAccount({ phrase: phrasePlatform })
  const accSender = await Account.getAccount({ phrase: phraseSender })
  const accReceiver = await Account.getAccount({ phrase: phraseReceiver })

  const senderBalance = await Account.getBalance({ acc: accSender })

  // For testing, fund the accounts.
  if (fundOnDevnet) {
    if (reach.canFundFromFaucet()) {
      // console.log('Need to fund accounts? senderBalance', senderBalance, 'transferAmount', transferAmount, 'receiverBalance', receiverBalance)
      if (senderBalance < transferAmount) {
        console.log('Attempt to fund accounts... senderBalance', senderBalance, '< transferAmount', transferAmount)
        const [platformRes, senderRes] = await Promise.all([
          Account.fundAccount({ acc: accPlatform, amount: 10 }),
          Account.fundAccount({ acc: accSender, amount: 10 })
        ])
        if (!platformRes || !senderRes) {
          return { success: false, error: 'Failed to fund platform or receiver account.' }
        }
      }
    } else {
      return { success: false, error: 'Unable to fund accounts from Faucet.' }
    }
  }

  // Send the gas fees to the Receiver so it can participate in contract without self funding.
  const platformBalance = await Account.getBalance({ acc: accPlatform })
  if (platformBalance < 2) {
    return { success: false, error: 'Platform does not have suffient funds to transfer gas fee to receiver.' }
  }
  const receiverBalance = await Account.getBalance({ acc: accReceiver })
  if (receiverBalance < 1) {
    const transferGasResult = await Account.transfer({ fromAcc: accPlatform, toAcc: accReceiver, amount: 1 })
    if (!transferGasResult) {
      return { success: false, error: 'Unable to fund receiver account with gas.' }
    }
  }

  return await TransferService.transfer({ accPlatform, accSender, accReceiver, transferAmount })
}

module.exports = {
  transfer
}
