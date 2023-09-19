export function validateTransfersHelper(balances, transfers) {
  if (balances.length && transfers.length) {
    const updatedBalances = [...balances];

    const updatedTransfers = transfers.map((transfer) => {
      const senderIndex = updatedBalances.findIndex(
        (balance) => balance.accountNumber === transfer.sender
      );

      if (senderIndex !== -1) {
        const senderBalance = updatedBalances[senderIndex];

        if (senderBalance.balance - transfer.amount >= 0) {
          senderBalance.balance -= transfer.amount;
          return { ...transfer, transferPossible: true };
        }
      }

      return { ...transfer, transferPossible: false };
    });

    return { updatedBalances, updatedTransfers };
  }

  return { updatedBalances: balances, updatedTransfers: transfers };
}
