import React from 'react';
import './UserDados.css';

function UserDados({ userData, setActiveSection }) {
  const handleEditClick = () => {
    setActiveSection('editar');
  };

  return (
    <div className='info-usuario'>
      <div className='bv'>
        <span>Olá, <span className='title'>{userData?.Nome}</span></span>
        <button className='edit-button' onClick={handleEditClick}>Editar</button>
      </div>
      <div className='section-dados'>
        <h4 className='title-dados'>Suas Informações</h4>
        <div>
          <span className='nome'>Nome:</span> <span>{userData?.Nome}</span><br />
          <span className='email'>Email:</span> <span>{userData?.Email_usuario}</span><br />
          <span className='endereco'>Endereço:</span> <span>{userData?.Endereco || 'Não fornecido'}</span><br />
          <span className='placa'>Placa do Veículo:</span> <span>{userData?.Placa_do_veiculo || 'Não fornecido'}</span><br />
          <span className='celular'>Número de Celular:</span> <span>{userData?.Numero_celular || 'Não fornecido'}</span><br />
        </div>
      </div>
    </div>
  );
}

export default UserDados;
