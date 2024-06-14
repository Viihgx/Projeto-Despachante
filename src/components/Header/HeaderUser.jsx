import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import './HeaderUser.css';

function HeaderUser({ userData }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:3000/logout', null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        console.log('Logout bem-sucedido');
        localStorage.removeItem('token');
        navigate('/'); // Redirecionar para a página de login
      } else {
        console.error('Erro ao realizar logout:', response.data.error);
      }
    } catch (error) {
      console.error('Erro ao realizar logout:', error);
    }
  };

  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos === 0);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);

  const handleNavigateHome = () => {
    navigate('/home');
  };

  return (
    <header className={`TopBar ${visible ? 'visible' : 'hidden'}`}>
      <div style={{ flexShrink: 0 }} onClick={handleNavigateHome}>
        <h1 className="logoTitle">Despacha+</h1>
      </div>
      <nav className="navigationBar">
        <ul>
          <li>
            <a href="#" className="navMenu" onClick={handleNavigateHome}>Voltar para Home</a>
          </li>
        </ul>
        
        {userData ? (
          <>
            <span>Olá, {userData.Nome}</span>
            <div style={{ cursor: "pointer" }} onClick={handleClick}>
              <PersonOutlineOutlinedIcon />
            </div>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>Sair</MenuItem>
            </Menu>
          </>
        ) : (
          <span>Carregando...</span>
        )}
      </nav>
    </header>
  );
}

export default HeaderUser;
