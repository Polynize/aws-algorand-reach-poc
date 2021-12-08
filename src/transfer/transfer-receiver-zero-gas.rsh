'reach 0.1'
'use strict'

/**
 * In order to even attach to the contract the Reciever MUST have at least some ALGO.
 * So, fund the Receiver using reach.tranfer(acc1, acc2, ALGOs) outside of the contract.
 * Also, to minimise the ALGO fees, minimise the work the Reciever does.
 */
const ONE_ALGO = 1000000

export const main = Reach.App(() => {
  const platformFee = ONE_ALGO
  const Sender = Participant('Sender', { getParams: Fun([], Object({ transferAmount: UInt })) })
  const Receiver = Participant('Receiver', {})
  const Platform = Participant('Platform', {})  
  deploy()

  Sender.only(() => { const { transferAmount } = declassify(interact.getParams()) })

  Sender.publish(transferAmount).pay(transferAmount + platformFee)
  commit()

  
  Receiver.publish()
  commit()

  Platform.publish()
  transfer(transferAmount).to(Receiver)
  transfer(platformFee).to(Platform)
  commit()

  exit()
})
