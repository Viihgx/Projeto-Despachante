import './Header.css';

function Header() {
  return (
    <header className="header">
      <div style={{ flexShrink: 0 }}>
        <h1>Despacha+</h1>
      </div>
      <nav className='nav-bar'>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Orçamento</a></li>
          <li><a href="#">Serviço</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
