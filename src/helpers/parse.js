import { FILE_TYPE_BALANCE, FILE_TYPE_TRANSFER } from "../models/fileType";

export const parseCSVData = (data, accountLength, fileType) => {
  const lines = data.split("\n");
  const parsedData = [];
  const errorLines = [];

  lines.forEach((line, index) => {
    line = line.trim();
    if (line) {
      const parts = line.split(",");
      if (fileType === FILE_TYPE_BALANCE) {
        // Parse account balances
        const match = /^(\d+),([\d.]+)$/.exec(line);
        if (match && match[1].length === accountLength) {
          const accountNumber = parseInt(match[1]);
          const balance = parseFloat(match[2]);
          parsedData.push({ accountNumber, balance });
        } else {
          errorLines.push(index + 1);
        }
      } else if (fileType === FILE_TYPE_TRANSFER) {
        // Parse transfers
        if (parts.length === 3) {
          const sender = parseInt(parts[0]);
          const receiver = parseInt(parts[1]);
          const amount = parseFloat(parts[2]);

          if (
            // check account length is correct and amount superior to 0
            sender.toString().length === accountLength &&
            receiver.toString().length === accountLength &&
            amount >= 0
          ) {
            parsedData.push({ sender, receiver, amount });
          } else {
            errorLines.push(index + 1);
          }
        } else {
          errorLines.push(index + 1);
        }
      }
    }
  });

  return { parsedData, errorLines };
};
