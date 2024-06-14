import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Usuario.css';
import UserDados from './UserDados';
import UserServicos from './UserServicos';
import SidebarUser from './SidebarUser/SidebarUser';
import EditPerfil from './EditPerfil/EditPerfil';
import VeiculosUser from './VeiculosUser/VeiculosUser';
import HeaderUser from '../Header/HeaderUser';

function Usuario() {
  const [activeSection, setActiveSection] = useState('info');
  const [userData, setUserData] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [veiculos, setVeiculos] = useState([]); // Adiciona o estado para os veículos

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/protected-route', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data.user);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    const fetchUserServices = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/user-services', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setServicos(response.data.servicos);
      } catch (error) {
        console.error('Erro ao buscar serviços do usuário:', error);
      }
    };

    const fetchUserVehicles = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/user-vehicles', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVeiculos(response.data.veiculos);
      } catch (error) {
        console.error('Erro ao buscar veículos do usuário:', error);
      }
    };

    fetchUserData();
    fetchUserServices();
    fetchUserVehicles();
  }, []);

  return (
    <div className='container-user-master'>
      <HeaderUser userData={userData} />
      <div className="container-user">
        <SidebarUser activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="usuario-container">
          <div className="content">
            {activeSection === 'editar' ? (
              <EditPerfil userData={userData} />
            ) : (
              <>
                {activeSection === 'info' && <UserDados userData={userData} setActiveSection={setActiveSection} />}
                {activeSection === 'servicos' && <UserServicos servicos={servicos} />}
                {activeSection === 'veiculos' && <VeiculosUser veiculos={veiculos} setVeiculos={setVeiculos} />} {/* Passa os veículos e a função setVeiculos */}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Usuario;
