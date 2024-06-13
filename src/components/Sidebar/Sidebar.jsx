import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Menu</h2>
      <ul>
        <li>
          <Link to="/moderador">Serviços Solicitados</Link>
        </li>
        <li>
          <Link to="/moderador/servicos-vistos">Serviços Vistos</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
