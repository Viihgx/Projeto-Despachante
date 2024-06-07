import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './RecuperarSenha.css';

function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [pinEnviado, setPinEnviado] = useState(false);

  const handleEnviarPin = async () => {
    if (!email) {
      setError('Por favor, preencha o email.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/recuperar-senha', { email });
      setMessage('Um PIN de redefinição de senha foi enviado para seu email.');
      setError('');
      setPinEnviado(true);
    } catch (error) {
      setError('Erro ao tentar enviar o PIN. Tente novamente mais tarde.');
    }
  };

  const handleRedefinirSenha = async () => {
    if (!email || !pin || !novaSenha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/redefinir-senha', { email, pin, novaSenha });
      setMessage('Senha redefinida com sucesso.');
      setError('');
    } catch (error) {
      setError('Erro ao tentar redefinir a senha. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="recuperar-senha-container">
      <form className="recuperar-senha-form" onSubmit={(e) => e.preventDefault()}>
        <h2>Recuperar Senha</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="recuperar-senha-input"
        />
        {pinEnviado && (
          <>
            <input
              type="text"
              placeholder="PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="recuperar-senha-input"
            />
            <input
              type="password"
              placeholder="Nova Senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="recuperar-senha-input"
            />
          </>
        )}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!pinEnviado ? (
          <button type="button" className="recuperar-senha-button" onClick={handleEnviarPin}>
            Enviar PIN
          </button>
        ) : (
          <button type="button" className="recuperar-senha-button" onClick={handleRedefinirSenha}>
            Redefinir Senha
          </button>
        )}
        <Link to='/Login' style={{ textDecoration: 'none' }}>
          <p>Voltar para Login</p>
        </Link>
      </form>
    </div>
  );
}

export default RecuperarSenha;
