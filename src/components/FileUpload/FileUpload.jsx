import React, { useState, useEffect } from 'react';
import './FileUpload.css';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';

function FileUpload({ onFileSelect, selectedFile }) {
    const [localSelectedFile, setLocalSelectedFile] = useState(null);

    useEffect(() => {
        setLocalSelectedFile(selectedFile);
    }, [selectedFile]);

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (!files || !files.length) {
            console.error("Nenhum arquivo selecionado");
            return;
        }

        const file = files[0];
        setLocalSelectedFile(file);
        onFileSelect(file);
    };

    const handleRemoveFile = () => {
        setLocalSelectedFile(null);
        onFileSelect(null);
    };

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
            {localSelectedFile && (
                <div className="selected-file">
                    <span className="file-name">{localSelectedFile.name}</span>
                    <CloseIcon style={{ color: 'red', cursor: 'pointer', fontSize:'small' }} onClick={handleRemoveFile} />
                </div>
            )}
        </div>
    );
}

export default FileUpload;
