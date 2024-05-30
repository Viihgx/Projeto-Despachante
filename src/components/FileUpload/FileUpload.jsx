import React, { useState } from 'react';
import './FileUpload.css';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';

function FileUpload({ onFileSelect }) {
    const [selectedFile, setSelectedFile] = useState(null); // Adicionando o estado para o arquivo selecionado

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (!files || !files.length) {
            console.error("Nenhum arquivo selecionado");
            return;
        }

        const file = files[0];
        setSelectedFile(file); // Atualizando o estado com o arquivo selecionado
        onFileSelect(file); // Passa o arquivo selecionado de volta para o componente pai
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
            {/* Aqui permanece a parte de exibir o nome do arquivo selecionado e o botão de exclusão */}
            {selectedFile && (
                <div className="selected-file">
                    <span className="file-name">{selectedFile.name}</span>
                    <CloseIcon style={{ color: 'red', cursor: 'pointer', fontSize:'small' }} onClick={() => setSelectedFile(null)} />
                </div>
            )}
        </div>
    );
}

export default FileUpload;
