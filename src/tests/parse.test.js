import { parseCSVData } from "../helpers/parse";
import { FILE_TYPE_BALANCE, FILE_TYPE_TRANSFER } from "../models/fileType";

// parse CSV
describe("parseCSVData function errors", () => {
  const accountLength = 16;

  it("should add an error if balance account length is below 16", () => {
    const csvData = "1111,5000\n2222123433331212,550"; // Example CSV data

    const result = parseCSVData(csvData, accountLength, FILE_TYPE_BALANCE);
    expect(result.errorLines).toEqual([1]);
  });

  it("should add an error if balance account length is over 16", () => {
    const csvData = "11112345222267891234,5000\n2222123433331212,550";
    const result = parseCSVData(csvData, accountLength, FILE_TYPE_BALANCE);

    expect(result.errorLines).toEqual([1]);
  });

  it("should show an error for balance account number format mismatch", () => {
    const csvData = "1111234522226789a,5000\n2222123433331212,550";
    const result = parseCSVData(csvData, accountLength, FILE_TYPE_BALANCE);

    expect(result.errorLines).toEqual([1]);
  });

  it("should show an error if transfers parts count over 3", () => {
    const csvData = "1111234522226789,5000,extra,info\n2222123433331212,550";

    const result = parseCSVData(csvData, accountLength, FILE_TYPE_BALANCE);

    expect(result.errorLines).toEqual([1]);
  });

  it("should show an error if transfers parts count under 3", () => {
    const csvData = "1111234522226789,5000\n2222123433331212";

    const result = parseCSVData(csvData, accountLength, FILE_TYPE_BALANCE);

    expect(result.errorLines).toEqual([2]);
  });
});

describe("parseCSVData function correct", () => {
  it("should parses balance data correctly", () => {
    const csvData =
      "1111234522226789,5000\n2222123433331212,550\n1212343433335665,1200"; // Example balance CSV data
    const accountLength = 16;

    const result = parseCSVData(csvData, accountLength, FILE_TYPE_BALANCE);

    expect(result.parsedData).toEqual([
      { accountNumber: 1111234522226789, balance: 5000 },
      { accountNumber: 2222123433331212, balance: 550 },
      { accountNumber: 1212343433335665, balance: 1200 },
    ]);
  });

  it("should parse transfers data correctly", () => {
    const csvData =
      "1111234522226789,1212343433335665,500\n3212343433335755,2222123433331212,550\n";
    const accountLength = 16;

    const result = parseCSVData(csvData, accountLength, FILE_TYPE_TRANSFER);

    // Assert that parsedData contains the correct format
    expect(result.parsedData).toEqual([
      { sender: 1111234522226789, receiver: 1212343433335665, amount: 500 },
      { sender: 3212343433335755, receiver: 2222123433331212, amount: 550 },
    ]);
  });
});
