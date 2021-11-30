const reach = require('../utils/Reach').getReach()
const getBalance = require('../account/Account').getBalance
const transferSC = require('./build/transfer.cjs.js') // Smart Contract

async function transfer ({ accPlatform, accSender, accReceiver, transferAmount }) {
  try {
    const platformFee = 1

    if (!accPlatform || !accSender || !accReceiver) {
      return { success: false, error: 'Missing valid account details.' }
    }

    const beforePlatformBalance = await getBalance({ acc: accPlatform })
    const beforeSenderBalance = await getBalance({ acc: accSender })
    const beforeReceiverBalance = await getBalance({ acc: accReceiver })

    const totalAmount = platformFee + transferAmount
    if (beforeSenderBalance < totalAmount) {
      return { success: false, error: `Not enough funds to pay transfer amount and fee. Sender balance must be at least ${totalAmount}` }
    }

    const ctcSender = await accSender.contract(transferSC) // Creator of the contract to the blockchain
    const ctcReceiver = await accReceiver.contract(transferSC, ctcSender.getInfo()) // Receiver attaches to the existing contract
    const ctcPlatform = await accPlatform.contract(transferSC, ctcSender.getInfo()) // Platform attaches to the existing contract

    await Promise.all([
      transferSC.Sender(ctcSender, { getParams: () => ({ transferAmount: reach.parseCurrency(transferAmount) }) }),
      transferSC.Receiver(ctcReceiver, { }),
      transferSC.Platform(ctcPlatform, { getParams: () => ({ platformFee: reach.parseCurrency(platformFee) }) })
    ])

    const afterPlatformBalance = await getBalance({ acc: accPlatform })
    const afterSenderBalance = await getBalance({ acc: accSender })
    const afterReceiverBalance = await getBalance({ acc: accReceiver })

    return {
      success: true,
      message: 'Transfer success',
      data: {
        platformFee,
        transferAmount,
        beforePlatformBalance,
        beforeSenderBalance,
        beforeReceiverBalance,
        afterPlatformBalance,
        afterSenderBalance,
        afterReceiverBalance
      }
    }
  } catch (error) {
    console.log('error', error)
    return { success: false, error: 'Transfer Failed' }
  }
}

module.exports = {
  transfer
}
