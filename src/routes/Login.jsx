import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { TextField, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/system';
import axios from 'axios';
import './Login.css';

const CustomTextField = styled(TextField)({
    '& label': {
        color: 'white',
    },
    '& label.Mui-focused': {
        color: 'white',
    },
    '& .MuiInput-underline:before': {
        borderBottomColor: 'white',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'white',
        },
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
        '& input': {
            color: 'white',
        },
    },
});

const CustomOutlinedInput = styled(OutlinedInput)({
    '& fieldset': {
        borderColor: 'white',
    },
    '&:hover fieldset': {
        borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
        borderColor: 'white',
    },
    '& input': {
        color: 'white',
    },
    '& .MuiInputLabel-root': {
        color: 'white',
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: 'white',
    },
});

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleLogin = async () => {
        if (!email || !senha) {
            alert('Por favor, preencha o email e a senha.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/login', { email, senha });
            const { token, is_moderador } = response.data;
            localStorage.setItem('token', token);
            setError('');
            if (is_moderador) {
                navigate('/Moderador');
            } else {
                navigate('/Home');
            }
        } catch (error) {
            setError('Login falhou. Verifique suas credenciais e tente novamente.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                <h2>Login</h2>
                <CustomTextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    autoComplete="off"  
                    autoCapitalize="none"
                    autoCorrect="off"
                />
                <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password" style={{ color: 'white' }}>Senha</InputLabel>
                    <CustomOutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    style={{ color: 'white' }}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Senha"
                    />
                </FormControl>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="button" className="login-button" onClick={handleLogin}>
                    Entrar
                </button>
                <Link to='/RecuperarSenha' style={{ textDecoration: 'none' }}>
                <p>Esqueceu a Senha?</p>
                </Link>
                <Link to='/Cadastro' style={{ textDecoration: 'none' }}>
                    <p>Criar Conta</p>
                </Link>
            </form>
        </div>
    );
}

export default Login;
