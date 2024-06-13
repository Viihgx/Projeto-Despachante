import React, { useState, useEffect } from 'react';
import './FileUpload.css';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';

function FileUpload({ onFileSelect, selectedFiles }) {
  const [localSelectedFiles, setLocalSelectedFiles] = useState([]);

  useEffect(() => {
    setLocalSelectedFiles(selectedFiles);
  }, [selectedFiles]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) {
      console.error("Nenhum arquivo selecionado");
      return;
    }

    const updatedFiles = [...localSelectedFiles, ...files];
    setLocalSelectedFiles(updatedFiles);
    onFileSelect(updatedFiles);
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...localSelectedFiles];
    newFiles.splice(index, 1);
    setLocalSelectedFiles(newFiles);
    onFileSelect(newFiles);
  };

  return (
    <div className="file-upload" style={{ marginBottom: "100px" }}>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="fileInput"
        multiple
      />
      <div>
        <UploadFileIcon style={{ color: 'grey' }} />
      </div>
      <label htmlFor="fileInput" className="upload-button">
        Escolher arquivos
      </label>
      {localSelectedFiles.length > 0 && (
        <div className="selected-files">
          {localSelectedFiles.map((file, index) => (
            <div key={index} className="selected-file">
              <span className="file-name">{file.name}</span>
              <CloseIcon
                style={{ color: 'red', cursor: 'pointer', fontSize: 'small' }}
                onClick={() => handleRemoveFile(index)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
