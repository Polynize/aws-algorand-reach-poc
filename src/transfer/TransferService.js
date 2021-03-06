const reach = require('../utils/Reach').getReach()
const getBalance = require('../account/Account').getBalance
const smartContract = require('./build/transfer-receiver-zero-gas.cjs') // Smart Contract
const PLATFORM_FEE = 1

async function transfer ({ accPlatform, accSender, accReceiver, transferAmount }) {
  try {
    if (!accPlatform || !accSender || !accReceiver) {
      return { success: false, error: 'Missing valid account details.' }
    }

    const beforePlatformBalance = await getBalance({ acc: accPlatform })
    const beforeSenderBalance = await getBalance({ acc: accSender })
    const beforeReceiverBalance = await getBalance({ acc: accReceiver })

    // All accounts must have at least some balance to participate in the contract (pay gas ~0.001)
    if (beforePlatformBalance <= 0 || beforeSenderBalance < transferAmount) {
      console.log('accSender not enough funds!', accSender?.networkAccount?.addr)
      return { success: false, error: `Not enough funds for sender to pay transfer amount and receiver to pay fee. Sender balance must be at least ${transferAmount} and receiver must be at least ${PLATFORM_FEE}` }
    }

    const ctcSender = await accSender.contract(smartContract) // Creator of the contract to the blockchain
    const ctcReceiver = await accReceiver.contract(smartContract, ctcSender.getInfo()) // Receiver attaches to the existing contract
    const ctcPlatform = await accPlatform.contract(smartContract, ctcSender.getInfo()) // Platform attaches to the existing contract

    console.log('Executing contract...')
    await Promise.all([
      smartContract.Sender(ctcSender, { getParams: () => ({ transferAmount: reach.parseCurrency(transferAmount) }) }),
      smartContract.Platform(ctcPlatform, { }),
      smartContract.Receiver(ctcReceiver, { })
    ])

    const afterPlatformBalance = await getBalance({ acc: accPlatform })
    const afterSenderBalance = await getBalance({ acc: accSender })
    const afterReceiverBalance = await getBalance({ acc: accReceiver })

    return {
      success: true,
      message: 'Transfer success',
      data: {
        platformFee: PLATFORM_FEE,
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
  transfer,
  PLATFORM_FEE
}
