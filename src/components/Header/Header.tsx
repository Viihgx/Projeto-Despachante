import './Header.css';
import Button from '@mui/material/Button';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="Header">
      <div style={{ flexShrink: 0 }}>
        <h1 className="title-logo">Despacha+</h1>
      </div>
      <nav className='nav-bar'>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Orçamento</a></li>
          <li><a href="#">Serviço</a></li>
        </ul>
      <Button sx={{
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

      <Link to="/" style={{textDecoration: 'none', textTransform: 'none', color: 'white'}}>
      <PersonOutlineOutlinedIcon />
      </Link>

      </nav>
    </header>
  );
}

export default Header;
