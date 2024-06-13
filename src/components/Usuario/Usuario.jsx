import React, { useState, useEffect } from 'react';
import './Usuario.css';
import Header from '../Header/Header';
import { FaUser, FaTools } from 'react-icons/fa';
import axios from 'axios';
import UserDados from './UserDados';
import UserServicos from './UserServicos';

function Usuario() {
  const [activeSection, setActiveSection] = useState('info');
  const [userData, setUserData] = useState(null);
  const [servicos, setServicos] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/protected-route', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data.user);
    };

    const fetchUserServices = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/user-services', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setServicos(response.data.servicos);
    };

    fetchUserData();
    fetchUserServices();
  }, []);

  return (
    <div>
      <Header />
      <div className='img-topo'>
        <div className='desc'>Informações. Serviços</div>
        <div className='page-name'>Perfil do Usuário</div>
      </div>
      
      <div className='navigation-icons'>
        <div>
          <FaUser onClick={() => setActiveSection('info')} />
        </div>
        <div>
          <FaTools onClick={() => setActiveSection('servicos')} />
        </div>
      </div>

      {activeSection === 'info' && <UserDados userData={userData} />}
      {activeSection === 'servicos' && <UserServicos servicos={servicos} />}
    </div>
  );
}

export default Usuario;
