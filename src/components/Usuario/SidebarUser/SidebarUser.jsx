import React from 'react';
import './SidebarUser.css';
import { FaUser, FaTools } from 'react-icons/fa';

function SidebarUser({ activeSection, setActiveSection }) {
  return (
    <div className="sidebar-user">
      <h2>Minha Conta</h2>
      <div 
        className={`sidebar-user-item ${activeSection === 'info' ? 'active' : ''}`} 
        onClick={() => setActiveSection('info')}
      >
        <FaUser />
        <span>Informações</span>
      </div>
      <div 
        className={`sidebar-user-item ${activeSection === 'servicos' ? 'active' : ''}`} 
        onClick={() => setActiveSection('servicos')}
      >
        <FaTools />
        <span>Serviços</span>
      </div>
    </div>
  );
}

export default SidebarUser;
