import './Header.css';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ServicePopup from '../Service/ServicePopup'; 
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

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

        <div style={{cursor: "pointer"}} onClick={handleClick}>
          <PersonOutlineOutlinedIcon/>
        </div>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Meu Perfil</MenuItem>
          <MenuItem onClick={handleClose}>Sair</MenuItem>
        </Menu>

        {/* <Link to="/" style={{ textDecoration: 'none', textTransform: 'none', color: 'white' }}>
          <PersonOutlineOutlinedIcon />
        </Link> */}

      </nav>
      <ServicePopup isOpen={isServicePopupOpen} toggleModal={toggleServicePopup} />
    </header>
  );
}

export default Header;