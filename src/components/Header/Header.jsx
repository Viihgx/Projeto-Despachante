import './Header.css';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ServicePopup from '../Service/ServicePopup'; 
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { logout } from '../../Data/database';
import { Link } from 'react-router-dom';

function Header() {

  const [isServicePopupOpen, setIsServicePopupOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

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
    const { success, message } = await logout();
    if (success) {
      console.log('Logout bem-sucedido');
    } else {
      console.error('Erro ao realizar logout:', message);
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
        <Button 
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
        </Button>

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
