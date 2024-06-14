import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VeiculosUser.css';

function VeiculosUser({ veiculos, setVeiculos }) {
  const [newVehicle, setNewVehicle] = useState({ placa_veiculo: '', nome_veiculo: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVehicle = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:3000/add-vehicle', newVehicle, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setVeiculos((prev) => [...prev, response.data.veiculo]);
        setNewVehicle({ placa_veiculo: '', nome_veiculo: '' });
      } else {
        console.error('Erro do backend:', response.data.error);
      }
    } catch (error) {
      console.error('Erro ao adicionar veículo:', error);
    }
  };

  return (
    <div className="veiculos-user">
      <h2>Meus Veículos</h2>
      <div className="add-vehicle-form">
        <input
          type="text"
          name="placa_veiculo"
          placeholder="Placa do Veículo"
          value={newVehicle.placa_veiculo}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="nome_veiculo"
          placeholder="Nome do Veículo"
          value={newVehicle.nome_veiculo}
          onChange={handleInputChange}
        />
        <button onClick={handleAddVehicle}>Adicionar Veículo</button>
      </div>
      <div className="vehicles-list">
        <h3>Veículos Adicionados:</h3>
        {veiculos.length > 0 ? (
          <ul>
            {veiculos.map((vehicle, index) => (
              <li key={index}>
                {vehicle.placa_veiculo} - {vehicle.nome_veiculo}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum veículo adicionado ainda.</p>
        )}
      </div>
    </div>
  );
}

export default VeiculosUser;
