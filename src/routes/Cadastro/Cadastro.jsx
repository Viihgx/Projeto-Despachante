// import { Link } from 'react-router-dom';

import './Cadastro';

function Cadastro() {

  return (
    <div className="login-container">
      <form className="login-form">
        <h2>Crie sua conta</h2>

        <input type="name" className="login-input" placeholder="Nome" />
        <input type="email" className="login-input" placeholder="Email" />
        <input type="password" className="login-input" placeholder="Senha" />
        <button type="button" className="login-button" onClick={(() => {
            window.location.href = '/Home'
          })}>
          Inscrever-se
        </button>
        {/* <Link to='/Login'>
        <p>Login</p>
        </Link> */}
        ou continue com
        <div>
        <button className="btn-google" type="button">
          Registre-se com o Google
        </button>
        </div>
      </form>
    </div>
  );
}

export default Cadastro;