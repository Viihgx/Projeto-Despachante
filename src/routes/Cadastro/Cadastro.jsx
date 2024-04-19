// import { Link } from 'react-router-dom';

import './Cadastro.css';
import imageGoogle from '../../assets/img/googleIcon.png';
import imageApple from '../../assets/img/IconApple.png';
import imageEmail from '../../assets/img/IconEmail.png';
// import InputRegister from '../../components/input/InputRegister/InputRegister';

function Cadastro() {

  return (
    <div className="register-container">
      <div className="register-form">
        <h2 className='p-text'>Crie sua conta</h2>
        {/* <InputRegister /> */}
        <input type="name" className="register-input" placeholder="Nome" />
        <input type="email" className="register-input" placeholder="Email" />
        <input type="password" className="register-input" placeholder="Senha" />
        <button type="button" className="register-button" onClick={(() => {
            window.location.href = '/Home'
          })}>
          Inscrever-se
        </button>
        {/* <Link to='/Login'>
        <p>Login</p>
        </Link> */}
        <p className='p-text'>ou </p>
        <div className='container-other-register'>
          <div className="register-google" type="button">
            <img className='icon-google' src={imageGoogle}></img>
            Continuar com o Google
          </div>
          <div className="register-apple" type="button">
            <img className='icon-apple' src={imageApple}></img>
            Continuar com a Apple
          </div>
          <div className="register-email" type="button">
            <img className='icon-email' src={imageEmail}></img>
            Continuar com a Apple
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;