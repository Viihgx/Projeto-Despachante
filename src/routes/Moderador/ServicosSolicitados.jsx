import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ServicosSolicitados.css';
import ServicoDetailsPopup from '../../components/ServicoDetailsPopup/ServicoDetailsPopup';

function ServicosSolicitados() {
  const [servicos, setServicos] = useState([]);
  const [filteredServicos, setFilteredServicos] = useState([]);
  const [selectedServico, setSelectedServico] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchServicos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/moderador/servicos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Resposta da API:', response.data);
      setServicos(response.data.servicos);
      setFilteredServicos(response.data.servicos);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      setError('Erro ao buscar serviços');
    }
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  useEffect(() => {
    let filteredList = servicos.filter((servico) => {
      if (statusFilter && servico.status_servico !== statusFilter) {
        return false;
      }
      if (
        servico.tipo_servico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (servico.nome_completo && servico.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()))
      ) {
        return true;
      }
      return false;
    });
    setFilteredServicos(filteredList);
  }, [servicos, searchTerm, statusFilter]);

  const handleServicoClick = (servico) => {
    setSelectedServico(servico);
  };

  const handleClosePopup = () => {
    setSelectedServico(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleUpdateStatus = (servicoId, novoStatus) => {
    setServicos(prevServicos =>
      prevServicos.map(servico =>
        servico.id === servicoId ? { ...servico, status_servico: novoStatus } : servico
      )
    );
    setFilteredServicos(prevFilteredServicos =>
      prevFilteredServicos.map(servico =>
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
    <div className="servicos-solicitados-container">
      <h2>Todos os Serviços Solicitados</h2>
      {error && <p className="error">{error}</p>}
      <div className="filters">
        <label htmlFor="search">Pesquise: 
          <input
            type="text"
            placeholder="Pesquisar por tipo de serviço ou nome completo"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </label>
        <select value={statusFilter} onChange={handleStatusFilterChange}>
          <option value="">Todos os Status</option>
          <option value="Em Andamento">Em Andamento</option>
          <option value="Concluído">Concluído</option>
          <option value="Pendente">Pendente</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>
      <ul>
        {filteredServicos.map((servico) => (
          <li key={servico.id} onClick={() => handleServicoClick(servico)}>
            <h3>{servico.tipo_servico}</h3>
            <p>Nome: {servico.nome_completo || 'Nome não disponível'}</p>
            <p>ID Usuário: {servico.id_usuario}</p>
            <p>ID Serviço: {servico.id}</p>
            <p className='text-status-solicitacao'>
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

export default ServicosSolicitados;
