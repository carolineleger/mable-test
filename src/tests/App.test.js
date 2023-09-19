/* eslint-disable testing-library/no-unnecessary-act */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import App from "../App";

// File upload
describe("file upload errors", () => {
  it("should send an error message if no file is passed for balance", () => {
    render(<App />);
    const inputElement = screen.getByTestId("file-upload-balance");

    act(() => {
      userEvent.upload(inputElement, null);
    });

    expect(screen.getByText("Please select a file.")).toBeInTheDocument();
  });

  it("should send an error message if no file is passed for transfers", () => {
    render(<App />);

    const inputElement = screen.getByTestId("file-upload-transfer");

    act(() => {
      userEvent.upload(inputElement, null);
    });

    expect(screen.getByText("Please select a file.")).toBeInTheDocument();
  });

  it("should handle non-CSV file and display an error message", async () => {
    render(<App />);
    const inputElement = screen.getByTestId("file-upload-balance");

    const nonCSVFile = new File(["This is not a CSV file"], "non_csv.txt", {
      type: "text/plain", // Simulate a non-CSV file
    });

    const event = { target: { files: [nonCSVFile] } };

    // Trigger the file input change event
    fireEvent.change(inputElement, event);

    // Ensure that the error message is displayed
    expect(
      screen.getByText("Invalid file format. Please select a CSV file.")
    ).toBeInTheDocument();
  });
});
