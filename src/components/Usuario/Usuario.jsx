import React, { useState, useEffect } from 'react';
import './Usuario.css';
import axios from 'axios';
import UserDados from './UserDados';
import UserServicos from './UserServicos';
import SidebarUser from './SidebarUser/SidebarUser';

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
        {activeSection === 'info' && <UserDados userData={userData} />}
        {activeSection === 'servicos' && <UserServicos servicos={servicos} />}
      </div>
    </div>
  );
}

export default Usuario;
