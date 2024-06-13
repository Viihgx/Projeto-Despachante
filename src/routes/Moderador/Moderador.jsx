import React from 'react';
import { NavLink, useRoutes, Navigate } from 'react-router-dom';
import ServicosSolicitados from './ServicosSolicitados';
import ServicoVisto from './ServicosVisto';
import './Moderador.css';

function Moderador() {
  const routes = useRoutes([
    { path: '/servicos-solicitados', element: <ServicosSolicitados /> },
    { path: '/servico-visto', element: <ServicoVisto /> },
    { path: '/', element: <Navigate to="servicos-solicitados" replace /> },
  ]);

  return (
    <div className="moderador-container">
      <div className="sidebar">
        <h2>Despachante</h2>
        <ul>
          <li>
            <NavLink
              to="servicos-solicitados"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Serviços Solicitados
            </NavLink>
          </li>
          <li>
            <NavLink
              to="servico-visto"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Serviços em Andamento
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="content">
        {routes}
      </div>
    </div>
  );
}

export default Moderador;
