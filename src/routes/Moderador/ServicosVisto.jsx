import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ServicosVisto.css';
import ServicoDetailsPopup from '../../components/ServicoDetailsPopup/ServicoDetailsPopup';

function ServicosVisto() {
  const [servicos, setServicos] = useState([]);
  const [selectedServico, setSelectedServico] = useState(null);
  const [error, setError] = useState('');

  const fetchServicos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/moderador/servicos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Resposta da API:', response.data);
      const servicosAndamento = response.data.servicos.filter(servico => servico.status_servico === 'Em Andamento');
      setServicos(servicosAndamento);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      setError('Erro ao buscar serviços');
    }
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  const handleServicoClick = (servico) => {
    setSelectedServico(servico);
  };

  const handleClosePopup = () => {
    setSelectedServico(null);
  };

  const handleUpdateStatus = (servicoId, novoStatus) => {
    setServicos(prevServicos =>
      prevServicos.map(servico =>
        servico.id === servicoId ? { ...servico, status_servico: novoStatus } : servico
      )
    );
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
    <div className="outra-secao-container">
      <h2>Todos os Serviços em Andamento</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {servicos.map((servico) => (
          <li key={servico.id} onClick={() => handleServicoClick(servico)}>
            <h3>{servico.tipo_servico}</h3>
            <p>Nome: {servico.nome_completo || 'Nome não disponível'}</p>
            <p>ID Usuário: {servico.id_usuario}</p>
            <p>ID Serviço: {servico.id}</p>
            <p className='text-status-visto'>
              <strong>Status:</strong> 
              <span className="status-container" style={{ color: getStatusColor(servico.status_servico) }}>
                <span className="status-indicator" style={{ backgroundColor: getStatusColor(servico.status_servico) }}></span>
                {servico.status_servico}
              </span>
            </p>
            <p>Data Solicitação: {new Date(servico.data_solicitacao).toLocaleString()}</p>
          </li>
        ))}
      </ul>
      {selectedServico && (
        <ServicoDetailsPopup servico={selectedServico} onClose={handleClosePopup} onUpdateStatus={handleUpdateStatus} />
      )}
    </div>
  );
}

export default ServicosVisto;
