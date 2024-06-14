import React, { useState } from 'react';
import './UserServicos.css';
import ServicoUserPopup from './PopupServicoUser/ServicoUserPopup';
import { FaTrash } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';

function UserServicos({ servicos }) {
  const [selectedServico, setSelectedServico] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all-time');
  const [searchResults, setSearchResults] = useState(servicos);
  const [noResults, setNoResults] = useState(false);

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
      // TODO: Implement time filter logic
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
              placeholder='Buscar por ID ou tipo de serviço'
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
            <table>
              <thead>
                <tr>
                  <th>Tipo de Serviço</th>
                  <th>Forma de Pagamento</th>
                  <th>Status</th>
                  <th>Data da Solicitação</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((servico, index) => (
                  <tr key={index} onClick={() => handleServicoClick(servico)}>
                    <td>{servico.tipo_servico}</td>
                    <td>{servico.forma_pagamento}</td>
                    <td>{servico.status_servico}</td>
                    <td>{new Date(servico.data_solicitacao).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
