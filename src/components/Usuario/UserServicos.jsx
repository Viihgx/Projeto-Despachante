import React, { useState } from 'react';
import './UserServicos.css';
import ServicoUserPopup from './PopupServicoUser/ServicoUserPopup';

function UserServicos({ servicos }) {
  const [selectedServico, setSelectedServico] = useState(null);

  const handleServicoClick = (servico) => {
    setSelectedServico(servico);
  };

  const handleClosePopup = () => {
    setSelectedServico(null);
  };

  return (
    <div className='info-servico'>
      <div className='title-servico'>Meus Serviços</div>
      <div className='servicos-list'>
        {servicos.length > 0 ? (
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
              {servicos.map((servico, index) => (
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
        )}
      </div>
      {selectedServico && (
        <ServicoUserPopup servico={selectedServico} onClose={handleClosePopup} />
      )}
    </div>
  );
}

export default UserServicos;
