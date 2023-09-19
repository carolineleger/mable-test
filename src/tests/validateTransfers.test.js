import { validateTransfersHelper } from "../helpers/validateTransfers";

// validate transfers
describe("validateTransfersHelper function", () => {
  it("should add transferPossible: true when balance is sufficient", () => {
    const balances = [
      { accountNumber: 1111234522226789, balance: 5000 },
      { accountNumber: 2222123433331212, balance: 550 },
    ];
    const transfers = [
      {
        sender: 1111234522226789,
        receiver: 2222123433331212,
        amount: 2000,
      },
      { sender: 2222123433331212, receiver: 1111234522226789, amount: 100 },
    ];

    const { updatedTransfers } = validateTransfersHelper(balances, transfers);

    // Assert that transferPossible is true for both transfers
    expect(updatedTransfers).toEqual([
      {
        sender: 1111234522226789,
        receiver: 2222123433331212,
        amount: 2000,
        transferPossible: true,
      },
      {
        sender: 2222123433331212,
        receiver: 1111234522226789,
        amount: 100,
        transferPossible: true,
      },
    ]);
  });

  it("should add transferPossible: false when balance is insufficient", () => {
    const balances = [
      { accountNumber: 1111234522226789, balance: 5000 },
      { accountNumber: 2222123433331212, balance: 550 },
    ];
    const transfers = [
      {
        sender: 1111234522226789,
        receiver: 2222123433331212,
        amount: 6000,
      },
      {
        sender: 2222123433331212,
        receiver: 1111234522226789,
        amount: 1000,
      },
    ];

    const { updatedTransfers } = validateTransfersHelper(balances, transfers);

    // Assert that transferPossible is false for both transfers
    expect(updatedTransfers).toEqual([
      {
        sender: 1111234522226789,
        receiver: 2222123433331212,
        amount: 6000,
        transferPossible: false,
      },
      {
        sender: 2222123433331212,
        receiver: 1111234522226789,
        amount: 1000,
        transferPossible: false,
      },
    ]);
  });

  it("should handle errors if values in balances or transfers are not numbers", () => {
    const balances = [
      { accountNumber: 1111234522226789, balance: "not a number" }, // Invalid balance
      { accountNumber: 2222123433331212, balance: 550 },
    ];
    const transfers = [
      {
        sender: 1111234522226789,
        receiver: 2222123433331212,
        amount: 2000,
      },
      {
        sender: 2222123433331212,
        receiver: 1111234522226789,
        amount: "invalid",
      }, // Invalid amount
    ];

    const { updatedTransfers } = validateTransfersHelper(balances, transfers);

    // Assert that transferPossible is false for both transfers due to invalid values
    expect(updatedTransfers).toEqual([
      {
        sender: 1111234522226789,
        receiver: 2222123433331212,
        amount: 2000,
        transferPossible: false,
      },
      {
        sender: 2222123433331212,
        receiver: 1111234522226789,
        amount: "invalid",
        transferPossible: false,
      },
    ]);
  });
});
