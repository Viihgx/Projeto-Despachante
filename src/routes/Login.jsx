import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Atualize para useNavigate
import axios from 'axios';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Atualize para useNavigate

    const handleLogin = async () => {
        // Verifica se o email e a senha foram preenchidos
        if (!email || !senha) {
            alert('Por favor, preencha o email e a senha.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/login', { email, senha });
            const { token } = response.data;
            localStorage.setItem('token', token);
            setError('');
            // Redirecionar para a página Home após o login bem-sucedido
            navigate('/Home'); // Atualize para navigate
        } catch (error) {
            setError('Login falhou. Verifique suas credenciais e tente novamente.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                <h2>Login</h2>
                <input
                    type="email"
                    className="login-input"
                    placeholder="Email*"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="login-input"
                    placeholder="Senha*"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="button" className="login-button" onClick={handleLogin}>
                    Entrar
                </button>
                <p>Esqueceu a Senha?</p>
                <Link to='/Cadastro' style={{ textDecoration: 'none' }}>
                  <p>Criar Conta</p>
                </Link>
            </form>
        </div>
    );
}

export default Login;
