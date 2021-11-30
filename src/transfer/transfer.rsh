'reach 0.1'
'use strict'

export const main = Reach.App(() => {
  const Sender = Participant('Sender', { getParams: Fun([], Object({ transferAmount: UInt })) })
  const Receiver = Participant('Receiver', {})
  const Platform = Participant('Platform', { getParams: Fun([], Object({ platformFee: UInt })) })  
  deploy()

  Sender.only(() => { const { transferAmount } = declassify(interact.getParams()) })
  Platform.only(() => { const { platformFee } = declassify(interact.getParams()) })

  Sender.publish(transferAmount).pay(transferAmount)
  commit()

  Platform.publish(platformFee)
  commit()

  Receiver.publish().pay(platformFee)
  transfer(transferAmount).to(Receiver)
  transfer(platformFee).to(Platform)
  commit()

  exit()
})
