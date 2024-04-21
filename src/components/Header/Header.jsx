import { useState, useEffect } from 'react';
import './Header.css';
import Button from '@mui/material/Button';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Link } from 'react-router-dom';
import ServicePopup from '../Service/ServicePopup'; 

function Header() {
  const [isServicePopupOpen, setIsServicePopupOpen] = useState(false);

  const toggleServicePopup = () => {
    setIsServicePopupOpen(!isServicePopupOpen);
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

        <Link to="/" style={{ textDecoration: 'none', textTransform: 'none', color: 'white' }}>
          <PersonOutlineOutlinedIcon />
        </Link>

      </nav>
      <ServicePopup isOpen={isServicePopupOpen} toggleModal={toggleServicePopup} />
    </header>
  );
}

export default Header;