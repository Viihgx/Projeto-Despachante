import './Cadastro.css';
import imageGoogle from '../../assets/img/googleIcon.png';
import imageApple from '../../assets/img/IconApple.png';
import imageEmail from '../../assets/img/IconEmail.png';
import React, { useState } from 'react';
import axios from 'axios';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCadastro = async () => {
    if (!nome || !email || !senha) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    const usuario = {
      nome,
      email,
      senha
    };

    try {
      const response = await axios.post('http://localhost:3000/cadastro', usuario);
      if (response.data.success) {
        window.location.href = '/';
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage('Erro ao cadastrar usuário');
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2 className='p-text'>Crie sua conta</h2>
        <input
          type="text"
          className="register-input"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="email"
          className="register-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="register-input"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        
        <button type="button" className="register-button" onClick={handleCadastro}>
          Inscrever-se
        </button>
        <p className='p-text'>ou </p>
        <div className='container-other-register'>
          <div className="register-google" type="button">
            <img className='icon-google' src={imageGoogle} alt="Google Icon" />
            Continuar com o Google
          </div>
          <div className="register-apple" type="button">
            <img className='icon-apple' src={imageApple} alt="Apple Icon" />
            Continuar com a Apple
          </div>
          <div className="register-email" type="button">
            <img className='icon-email' src={imageEmail} alt="Email Icon" />
            Continuar com o Email
          </div>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default Cadastro;
