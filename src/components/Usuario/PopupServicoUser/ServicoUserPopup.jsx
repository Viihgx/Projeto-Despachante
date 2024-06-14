import React, { useState, useEffect } from 'react';
import './ServicoUserPopup.css';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

function ServicoUserPopup({ servico, onClose }) {
  const [filePdfs, setFilePdfs] = useState([]);
  const [updatedFiles, setUpdatedFiles] = useState([]);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    document.body.style.overflow = 'hidden'; // Disable scroll on body

    if (servico.file_pdfs) {
      try {
        const parsedPdfs = JSON.parse(servico.file_pdfs);
        if (Array.isArray(parsedPdfs)) {
          setFilePdfs(parsedPdfs);
        } else {
          console.error('file_pdfs is not an array:', parsedPdfs);
        }
      } catch (error) {
        console.error('Erro ao parsear file_pdfs:', error);
      }
    }

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/messages/${servico.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setMessages(response.data.messages);
        } else {
          console.error('Erro ao buscar mensagens:', response.data.message);
        }
      } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
      }
    };

    fetchMessages();

    return () => {
      document.body.style.overflow = 'auto'; // Re-enable scroll on body when popup is closed
    };
  }, [servico]);

  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const updated = [...updatedFiles];
      updated[index] = file;
      setUpdatedFiles(updated);
      setIsConfirmVisible(true);
    }
  };

  const handleConfirmUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const newFilePdfs = [...filePdfs];

      for (const [index, file] of updatedFiles.entries()) {
        if (file) {
          const formData = new FormData();
          formData.append('pdf', file);

          const response = await axios.post(`http://localhost:3000/update-pdf/${servico.id}/${index}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.success) {
            newFilePdfs[index] = response.data.fileUrl;
          } else {
            console.error('Erro ao atualizar PDF:', response.data.message);
          }
        }
      }

      setFilePdfs(newFilePdfs);
      setUpdatedFiles([]);
      setIsConfirmVisible(false);
    } catch (error) {
      console.error('Erro ao atualizar PDFs:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Concluído':
        return '#28a745'; // verde
      case 'Cancelado':
        return '#dc3545'; // vermelho
      case 'Em Andamento':
        return '#007bff'; // azul
      case 'Pendente':
        return '#ffc107'; // amarelo
      default:
        return '#6c757d'; // cinza
    }
  };

  return (
    <div className="servico-popup-overlay">
      <div className="servico-popup-content">
        <CloseIcon className="close-icon" onClick={onClose} />
        <h2>Detalhes do Serviço</h2>
        <div className="servico-details">
          <p><strong>Tipo de Serviço:</strong> {servico.tipo_servico}</p>
          <p><strong>ID do Serviço:</strong> {servico.id}</p>
          <p><strong>Nome Completo:</strong> {servico.nome_completo || 'Não disponível'}</p>
          <p><strong>Placa do Veículo:</strong> {servico.placa_do_veiculo || 'Não disponível'}</p>
          <p><strong>Apelido do Veículo:</strong> {servico.apelido_do_veiculo || 'Não disponível'}</p>
          <p><strong>Forma de Pagamento:</strong> {servico.forma_pagamento || 'Não disponível'}</p>
          <p>
            <strong>Status:</strong>
            <span
              className="status"
              style={{ color: getStatusColor(servico.status_servico) }}
            >
              <span
                className="status-indicator"
                style={{ backgroundColor: getStatusColor(servico.status_servico) }}
              ></span>
              {servico.status_servico}
            </span>
          </p>
          <p><strong>Data da Solicitação:</strong> {new Date(servico.data_solicitacao).toLocaleString()}</p>
        </div>
        <h3>Documentos:</h3>
        {filePdfs.length > 0 ? (
          filePdfs.map((file, index) => (
            <div key={index} className="document-container">
              <a href={file} target="_blank" rel="noopener noreferrer">Documento {index + 1}</a>
              <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(index, e)} />
            </div>
          ))
        ) : (
          <p>Nenhum documento disponível.</p>
        )}
        {isConfirmVisible && (
          <button className="btn-confirm" onClick={handleConfirmUpdate}>Confirmar Atualizações</button>
        )}
        <h3>Mensagens do Moderador:</h3>
        <div className="messages-container">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div key={index} className="message">
                <p><strong>Moderador:</strong> {message.text}</p>
                <p><em>{new Date(message.timestamp).toLocaleString()}</em></p>
              </div>
            ))
          ) : (
            <p>Nenhuma mensagem disponível.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServicoUserPopup;
