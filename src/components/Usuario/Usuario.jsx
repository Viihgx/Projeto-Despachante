import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Usuario.css';
import UserDados from './UserDados';
import UserServicos from './UserServicos';
import SidebarUser from './SidebarUser/SidebarUser';
import EditPerfil from './EditPerfil/EditPerfil';

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
    <div className="usuario-container">
      <SidebarUser activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="content">
        {activeSection === 'editar' ? (
          <EditPerfil userData={userData} />
        ) : (
          <>
            {activeSection === 'info' && <UserDados userData={userData} setActiveSection={setActiveSection} />}
            {activeSection === 'servicos' && <UserServicos servicos={servicos} />}
          </>
        )}
      </div>
    </div>
  );
}

export default Usuario;
