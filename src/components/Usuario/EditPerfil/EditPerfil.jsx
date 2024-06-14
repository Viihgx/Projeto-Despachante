import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EditPerfil.css';

function EditPerfil({ userData, setIsEditing }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    endereco: '',
    placa_veiculo: '',
    numero_celular: '',
    senhaAtual: ''
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        nome: userData.Nome,
        email: userData.Email_usuario,
        endereco: userData.Endereco || '',
        placa_veiculo: userData.Placa_do_veiculo || '',
        numero_celular: userData.Numero_celular || '',
        senhaAtual: ''
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.senhaAtual) {
      toast.error('Por favor, insira a senha atual para atualizar o perfil', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:3000/update-profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success('Perfil atualizado com sucesso!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setFormData((prevData) => ({
          ...prevData,
          senhaAtual: ''
        }));
        if (typeof setIsEditing === 'function') {
          setIsEditing(false);
        }
      } else {
        toast.error(response.data.message || 'Erro ao atualizar perfil', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error(error.response?.data?.message || 'Erro ao atualizar perfil', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="edit-perfil-container">
      <h1>Editar Perfil</h1>
      <div className='form-perfil'>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endereco">Endereço</label>
            <input
              type="text"
              id="endereco"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="placa_veiculo">Placa do Veículo</label>
            <input
              type="text"
              id="placa_veiculo"
              name="placa_veiculo"
              value={formData.placa_veiculo}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="numero_celular">Número de Celular</label>
            <input
              type="text"
              id="numero_celular"
              name="numero_celular"
              value={formData.numero_celular}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="senhaAtual">Senha Atual</label>
            <input
              type="password"
              id="senhaAtual"
              name="senhaAtual"
              value={formData.senhaAtual}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn-submit">Salvar</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default EditPerfil;
