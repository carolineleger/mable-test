import "./App.css";
import React, { useState } from "react";
import Header from "./components/Header";
import FileUpload from "./components/FileUpload";
import { parseCSVData } from "./helpers/parse";
import { FILE_TYPE_BALANCE, FILE_TYPE_TRANSFER } from "./models/fileType";
import { validateTransfersHelper } from "./helpers/validateTransfers";

function App() {
  const [error, setError] = useState(null);
  const [balances, setBalances] = useState([]);
  const [transfers, setTransfers] = useState([]);

  const fileReader = new FileReader();
  const accountLength = 16; // account number length

  // upload file
  const handleFileChange = (e, fileType) => {
    e.preventDefault();

    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }

    if (!selectedFile.name.endsWith(".csv")) {
      setError("Invalid file format. Please select a CSV file.");
      return;
    }

    fileReader.onload = function (event) {
      const csvOutput = event.target.result;
      const { parsedData, errorLines } = parseCSVData(
        csvOutput,
        accountLength,
        fileType
      );

      if (errorLines.length > 0) {
        handleLineErrors(errorLines);
      } else {
        // Set data based on the file type (balances or transfers)
        if (fileType === FILE_TYPE_BALANCE) {
          setBalances(parsedData);
        } else if (fileType === FILE_TYPE_TRANSFER) {
          setTransfers(parsedData);
        }
      }
    };

    fileReader.readAsText(e.target.files[0]);
  };

  const validateTransfers = () => {
    setError("");
    const { updatedBalances, updatedTransfers } = validateTransfersHelper(
      balances,
      transfers
    );

    setBalances(updatedBalances);
    setTransfers(updatedTransfers);
  };

  // Errors handling - further improvement would be to add more details on the type of error
  const handleLineErrors = (errorLines) => {
    if (errorLines.length) {
      const lines = errorLines.join(", ");
      setError(`Invalid format on lines: ${lines}`);
    }
  };

  return (
    <div className="app">
      <Header />
      {error && (
        <p className="p-3 mb-2 bg-danger text-white text-center">{error}</p>
      )}
      <main className="container">
        <section className="row gx-5">
          <FileUpload
            handleFileChange={handleFileChange}
            fileType="balance"
            setData={setBalances}
            title="Provide a CSV file with the <span class='text-warning'>accounts balances</span>"
          />
          <FileUpload
            handleFileChange={handleFileChange}
            fileType="transfer"
            setData={setTransfers}
            title="Provide a CSV file for the <span class='text-warning'>transfers</span> you want to make"
          />
        </section>

        {transfers.length > 0 && (
          <div className="py-4">
            <h3>Transfers list:</h3>
            <ul className="list-group">
              {transfers.map((item, index) => (
                <li
                  key={index}
                  className={`list-group-item ${
                    item.transferPossible === true
                      ? "text-success"
                      : item.transferPossible === false
                      ? "text-danger"
                      : ""
                  }`}
                >
                  <b>{item.sender}</b> to <b>{item.receiver}</b> : {item.amount}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center my-4">
          <button
            type="button"
            className="btn btn-primary text-center"
            onClick={() => validateTransfers()}
            disabled={!balances.length || !transfers.length}
            data-testid="checkTransfersButton"
          >
            Check the transfers
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
