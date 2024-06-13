import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import './ServicoDetailsPopup.css';
import atualizarStatusServico from '../../Data/AtualizarServico';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import axios from 'axios';

function ServicoDetailsPopup({ servico, onClose, onUpdateStatus }) {
  const [mensagem, setMensagem] = useState('');
  const [status, setStatus] = useState(servico.status_servico);
  const [filePdfs, setFilePdfs] = useState([]);

  useEffect(() => {
    console.log('Serviço:', servico);
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
  }, [servico]);

  const handleEnviarMensagem = async () => {
    if (mensagem.trim() === '') return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:3000/send-message`,
        {
          servicoId: servico.id,
          text: mensagem,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log('Mensagem enviada:', mensagem);
        setMensagem('');
      } else {
        console.error('Erro ao enviar mensagem:', response.data.message);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const handleStatusChange = async (e) => {
    const novoStatus = e.target.value;
    setStatus(novoStatus);
    try {
      await atualizarStatusServico(servico.id, novoStatus);
      onUpdateStatus(servico.id, novoStatus);
    } catch (error) {
      console.error('Erro ao atualizar o status do serviço:', error);
    }
  };

  const downloadButtonStyles = {
    backgroundColor: '#111c55',
    width: '26%',
    height: '40px',
    color: 'white',
    '&:hover': {
      backgroundColor: '#0e1543',
    },
  };

  return (
    <div className="servico-details-popup">
      <div className="servico-details-content">
        <CloseIcon style={{ cursor: 'pointer', marginBottom: '15px', width: '30px', height: '30px' }} onClick={onClose} />
        <h2>Detalhes do Serviço</h2>
        <p><strong>Tipo de Serviço:</strong> {servico.tipo_servico}</p>
        <p><strong>Nome:</strong> {servico.Usuarios ? servico.Usuarios.Nome : 'Nome não disponível'}</p>
        <p><strong>Email:</strong> {servico.Usuarios ? servico.Usuarios.Email_usuario : 'Email não disponível'}</p>
        <p><strong>ID Usuário:</strong> {servico.id_usuario}</p>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Data Solicitação:</strong> {new Date(servico.data_solicitacao).toLocaleString()}</p>
        <h3>Documentos:</h3>
        {filePdfs.length > 0 ? (
          filePdfs.map((file, index) => (
            <div key={index} className="download-container">
              <a href={file} target="_blank" rel="noopener noreferrer" download={`servico-${servico.id}-documento-${index + 1}.pdf`}>
                Download PDF {index + 1}
              </a>
              <Button
                className='btn-download'
                sx={downloadButtonStyles}
                variant="contained"
                endIcon={<CloudDownloadIcon />}
              >
                <a className='download-p' href={file} target="_blank" rel="noopener noreferrer" download={`servico-${servico.id}-documento-${index + 1}.pdf`}>
                  Baixar PDF
                </a>
              </Button>
            </div>
          ))
        ) : (
          <p>Nenhum documento disponível.</p>
        )}
        <h3>Atualize o Status:</h3>
        <div className="select-wrapper">
          <select value={status} onChange={handleStatusChange}>
            <option value="Pendente">Pendente</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Concluído">Concluído</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
        <h3>Enviar Mensagem ao Cliente:</h3>
        <textarea
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        <button className='btn-enviar-msg' onClick={handleEnviarMensagem}>Enviar</button>
      </div>
    </div>
  );
}

export default ServicoDetailsPopup;
