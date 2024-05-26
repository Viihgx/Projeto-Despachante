import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import './Header.css';
// import { logout } from '../../Data/database';
// import Button from '@mui/material/Button';
// import ServicePopup from '../Service/ServicePopup'; 

function Header({ userData }) {
  const navigate = useNavigate(); // Usando useNavigate para navegação programática

  const [anchorEl, setAnchorEl] = useState(null);
  const [isServicePopupOpen, setIsServicePopupOpen] = useState(false);

  const toggleServicePopup = () => {
    setIsServicePopupOpen(!isServicePopupOpen);
  };

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
        navigate('/'); // Usando navigate para redirecionar para a página de login
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
        {/* <Button 
        onClick={(e) => { e.preventDefault(); toggleServicePopup(); }}
        sx={{
          borderRadius: '2.7rem',
          background: 'var(--cor-secundaria)',
          color: 'color: rgba(17, 17, 17, 1)',
          fontSize: '13px',
          fontWeight: '550',
          border: '.5px solid #fff',
          lineHeight: '1.5',
          '&:hover': {
            background: 'var(--cor-primaria)',
          },
        }} variant="contained">
          Solicitar
        </Button> */}
        <span>Olá, {userData.Nome}</span>
        <div style={{ cursor: "pointer" }} onClick={handleClick}>
          <PersonOutlineOutlinedIcon />
        </div>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Meu Perfil</MenuItem>
          <Link to="/" ><MenuItem onClick={handleLogout}>Sair</MenuItem></Link>
        </Menu>
      </nav>
      {/* <ServicePopup isOpen={true} toggleModal={toggleModal} /> */}
    </header>
  );
}

export default Header;
