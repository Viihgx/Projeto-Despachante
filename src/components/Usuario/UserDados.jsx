import React from 'react';
import './UserDados.css';

function UserDados({ userData }) {
  return (
    <div className='info-usuario'>
      <div className='bv'>olá, <span className='title'>{userData?.Nome}</span></div>
      <div className='section-dados'>
        <h4 className='title-dados'>Dados</h4>
        <span className='nome'>Nome:</span> <span>{userData?.Nome}</span><br />
        <span className='email'>Email:</span> <span>{userData?.Email_usuario}</span><br />
      </div>
    </div>
  );
}

export default UserDados;
