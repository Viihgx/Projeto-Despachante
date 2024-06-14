import React, { useState, useEffect } from 'react';
import './UserServicos.css';
import ServicoUserPopup from './PopupServicoUser/ServicoUserPopup';
import { FaTrash, FaSearch } from 'react-icons/fa';

function UserServicos({ servicos }) {
  const [selectedServico, setSelectedServico] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all-time');
  const [searchResults, setSearchResults] = useState(servicos);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    handleSearch();
  }, [filterStatus, searchTerm, timeFilter]);

  const handleServicoClick = (servico) => {
    setSelectedServico(servico);
  };

  const handleClosePopup = () => {
    setSelectedServico(null);
  };

  const handleSearch = () => {
    const filtered = servicos.filter((servico) => {
      const matchesStatus = filterStatus === 'all' || servico.status_servico === filterStatus;
      const matchesSearchTerm = servico.tipo_servico.toLowerCase().includes(searchTerm.toLowerCase()) || servico.id.toString().includes(searchTerm);
      // Implement time filter logic if needed
      return matchesStatus && matchesSearchTerm;
    });
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
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
            <option value='all-time'>Todo tempo</option>
            <option value='last-6-months'>Últimos 6 meses</option>
            <option value='last-1-year'>Último 1 ano</option>
            <option value='last-2-years'>Últimos 2 anos</option>
          </select>
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
                  {/* <strong>Forma de Pagamento:</strong> */}
                  <strong>Status:</strong>
                  <strong>Data da Solicitação:</strong>
                </div>
                <div className="servico-info-row">
                  <p>{servico.id}</p>
                  <p>{servico.tipo_servico}</p>
                  {/* <p>{servico.forma_pagamento}</p> */}
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
