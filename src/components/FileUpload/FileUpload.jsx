import React, { useState } from 'react';
import './FileUpload.css';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';

function FileUpload({ onFileSelect }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isFileSelected, setIsFileSelected] = useState(false);
  
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      setSelectedFile(file);
      setIsFileSelected(!!file); // Define como verdadeiro se houver um arquivo selecionado
      onFileSelect(file);
    };

    const cancelFileSelection = () => {
      setSelectedFile(null);
      setIsFileSelected(false); // Define como falso ao cancelar a seleção do arquivo
      onFileSelect(null);
    };

    console.log("isFileSelected:", isFileSelected); // Adiciona um log para acompanhar o estado isFileSelected

  return (
    <div className="file-upload" style={{marginBottom:"100px"}}>
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
