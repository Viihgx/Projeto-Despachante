import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../Data/database.js'; // Importando a função login
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = async () => {
        // Verifica se o email e a senha foram preenchidos
        if (!email || !senha) {
            alert('Por favor, preencha o email e a senha.');
            return;
        }

        // Chama a função login para validar o usuário
        const { success, message } = await login(email, senha);

        if (success) {
            // Redireciona para a página inicial se o login for bem-sucedido
            window.location.href = '/Home';
        } else {
            // Exibe mensagem de erro se o login falhar
            alert(message);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form">
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
                <button type="button" className="login-button" onClick={handleLogin}>
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