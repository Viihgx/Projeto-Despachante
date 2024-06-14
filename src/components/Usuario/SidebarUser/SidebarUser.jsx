import React from 'react';
import './SidebarUser.css';
import PersonIcon from '@mui/icons-material/Person';
import HandymanIcon from '@mui/icons-material/Handyman';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

function SidebarUser({ activeSection, setActiveSection }) {
  return (
    <div className="sidebar-user">
      <h2>Minha Conta</h2>
      <div 
        className={`sidebar-user-item ${activeSection === 'info' ? 'active' : ''}`} 
        onClick={() => setActiveSection('info')}
      >
        <PersonIcon />
        <span>Informações</span>
      </div>
      <div 
        className={`sidebar-user-item ${activeSection === 'servicos' ? 'active' : ''}`} 
        onClick={() => setActiveSection('servicos')}
      >
        <HandymanIcon />
        <span>Meus Serviços</span>
      </div>
      <div 
        className={`sidebar-user-item ${activeSection === 'editar' ? 'active' : ''}`} 
        onClick={() => setActiveSection('editar')}
      >
        <ModeEditIcon />
        <span>Editar Perfil</span>
      </div>
      <div 
        className={`sidebar-user-item ${activeSection === 'veiculos' ? 'active' : ''}`} 
        onClick={() => setActiveSection('veiculos')}
      >
        <DirectionsCarIcon />
        <span>Meus Veículos</span>
      </div>
    </div>
  );
}

export default SidebarUser;
