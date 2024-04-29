import React, { useState } from 'react';
import './FileUpload.css';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';

function FileUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
  
    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
    };

    const cancelFileSelection = () => {
      setSelectedFile(null);
    };

  return (
    <div className="file-upload">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }} 
        id="fileInput"
      />
      <div>
        <UploadFileIcon style={{ color: 'grey' }} />
      </div>
      <label htmlFor="fileInput" className="upload-button">
        Escolher arquivo
      </label>
      {selectedFile && (
        <div className="selected-file">
          <span className="file-name">{selectedFile.name}</span>
          <CloseIcon style={{ color: 'red', cursor: 'pointer', fontSize:'small' }} onClick={cancelFileSelection} />
        </div>
      )}
    </div>
  );
}

export default FileUpload;
