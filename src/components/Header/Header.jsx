import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import './Header.css';

function Header({ userData }) {
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

  const handleMeuPerfil = () => {
    navigate('/Usuario'); // Redirecionar para a página de perfil do usuário
    handleClose();
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

  return (
    <header className={`Header ${visible ? 'visible' : 'hidden'}`}>
      <div style={{ flexShrink: 0 }}>
        <h1 className="title-logo">Despacha+</h1>
      </div>
      <nav className='nav-bar'>
        <ul>
          <li>
            <a href="#" className="Menu">Home</a>
          </li>
          <li>
            <a href="#" className="Menu">Orçamento</a>
          </li>
          <li>
            <a href="#" className="Menu">Serviço</a>
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
              <MenuItem onClick={handleMeuPerfil}>Meu Perfil</MenuItem>
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

export default Header;