import './Login.css';

function Login() {

  return (
    <div className="login-container">
      <form className="login-form">
        <h2>Login</h2>
        <input type="email" className="login-input" placeholder="Email*" />
        <input type="password" className="login-input" placeholder="Senha*" />
        <button type="button" className="login-button" onClick={(() => {
            window.location.href = '/Home'
          })}>
          Entrar
        </button>
        <p>Esqueceu a Senha?</p>
        <p>Criar Conta</p>
      </form>
    </div>
  );
}

export default Login;