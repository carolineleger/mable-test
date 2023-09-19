import React from "react";

function FileUpload({ handleFileChange, fileType, title }) {
  return (
    <div className="col-12 col-md-6">
      <h2 dangerouslySetInnerHTML={{ __html: title }}></h2>
      <form>
        <input
          type={"file"}
          accept={".csv"}
          className="form-control my-4"
          onChange={(e) => handleFileChange(e, fileType)}
          data-testid={"file-upload-" + fileType}
        />
      </form>
    </div>
  );
}

export default FileUpload;
