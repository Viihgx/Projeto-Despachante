import React, { useState, useEffect } from 'react';
import './UserServicos.css';
import ServicoUserPopup from './PopupServicoUser/ServicoUserPopup';
import { FaTrash, FaSearch, FaFilter } from 'react-icons/fa';

function UserServicos({ servicos }) {
  const [selectedServico, setSelectedServico] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('oldest-first');
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    handleSearch();
  }, [filterStatus, searchTerm, timeFilter]);

  useEffect(() => {
    handleSearch();
  }, [servicos]);

  const handleServicoClick = (servico) => {
    setSelectedServico(servico);
  };

  const handleClosePopup = () => {
    setSelectedServico(null);
  };

  const handleSearch = () => {
    let filtered = servicos.filter((servico) => {
      const matchesStatus = filterStatus === 'all' || servico.status_servico === filterStatus;
      const matchesSearchTerm = servico.tipo_servico.toLowerCase().includes(searchTerm.toLowerCase()) || servico.id.toString().includes(searchTerm);
      return matchesStatus && matchesSearchTerm;
    });

    if (timeFilter === 'most-recent') {
      filtered = filtered.sort((a, b) => new Date(b.data_solicitacao) - new Date(a.data_solicitacao));
    } else if (timeFilter === 'oldest-first') {
      filtered = filtered.sort((a, b) => new Date(a.data_solicitacao) - new Date(b.data_solicitacao));
    }

    setSearchResults(filtered);
    setNoResults(filtered.length === 0);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
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
    <div className='info-servico'>
      <div className='filter-container'>
        <div className='filter-status'>
          <span onClick={() => setFilterStatus('all')} className={filterStatus === 'all' ? 'active' : ''}>Ver tudo</span>
          <span onClick={() => setFilterStatus('Pendente')} className={filterStatus === 'Pendente' ? 'active' : ''}>Pendente</span>
          <span onClick={() => setFilterStatus('Em Andamento')} className={filterStatus === 'Em Andamento' ? 'active' : ''}>Em Andamento</span>
          <span onClick={() => setFilterStatus('Concluído')} className={filterStatus === 'Concluído' ? 'active' : ''}>Concluído</span>
          <span onClick={() => setFilterStatus('Cancelado')} className={filterStatus === 'Cancelado' ? 'active' : ''}>
            <FaTrash /> Cancelados
          </span>
        </div>
        <div className='filter-search'>
          <div className='search-container'>
            <button className='search-button' onClick={handleSearch}><FaSearch /></button>
            <input
              className='input-search'
              type='text'
              placeholder='Buscar por ID do serviço ou tipo de serviço'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className='select-container'>
            <FaFilter className='filter-icon' />
            <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
              <option value='most-recent'>Mais novo</option>
              <option value='oldest-first'>Mais antigo</option>
            </select>
          </div>
        </div>
      </div>
      <div className='servicos-list'>
        {noResults ? (
          <p>Nenhum resultado encontrado.</p>
        ) : (
          searchResults.length > 0 ? (
            searchResults.map((servico, index) => (
              <div key={index} className="servico-card" onClick={() => handleServicoClick(servico)}>
                <div className="servico-info-row">
                  <strong>ID do Serviço:</strong>
                  <strong>Tipo de Serviço:</strong>
                  <strong>Status:</strong>
                  <strong>Data da Solicitação:</strong>
                </div>
                <div className="servico-info-row">
                  <p>{servico.id}</p>
                  <p>{servico.tipo_servico}</p>
                  <p>
                    <span className="status-container" style={{ color: getStatusColor(servico.status_servico) }}>
                      <span className="status-indicator" style={{ backgroundColor: getStatusColor(servico.status_servico) }}></span>
                      {servico.status_servico}
                    </span>
                  </p>
                  <p>{new Date(servico.data_solicitacao).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Você não solicitou nenhum serviço ainda.</p>
          )
        )}
      </div>
      {selectedServico && (
        <ServicoUserPopup servico={selectedServico} onClose={handleClosePopup} />
      )}
    </div>
  );
}

export default UserServicos;
