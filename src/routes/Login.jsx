//import { useState } from 'react';
import { Link } from 'react-router-dom';
//import { login } from '../Data/database.js'; 
import './Login.css';

function Login() {
  // const [email, setEmail] = useState('');
  // const [senha, setSenha] = useState('');
  // const [erroLogin, setErroLogin] = useState('');

  // const handleEmailChange = (event) => {
  //   setEmail(event.target.value);
  // };

  // const handleSenhaChange = (event) => {
  //   setSenha(event.target.value);
  // };

  // const fazerLogin = async () => {
  //   try {
  //     const response = await login(email, senha);
  //     if (response.success) {
  //       // Login bem-sucedido, redirecionar para a página Home
  //       window.location.href = '/';
  //     } else {
  //       // Login falhou, exibir mensagem de erro
  //       setErroLogin('Email ou senha inválidos');
  //     }
  //   } catch (error) {
  //     console.error('Erro ao fazer login:', error);
  //     setErroLogin('Erro ao fazer login');
  //   }
  // };

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
        <Link to='/Cadastro'>
        <p>Criar Conta</p>
        </Link>
      </form>
    </div>
  );
}

export default Login;