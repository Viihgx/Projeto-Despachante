import { Routes, Route } from 'react-router-dom';
import Login from './routes/Login';
import Home from './routes/Home';
import Cadastro from './routes/Cadastro/Cadastro';
import ServicePopup from './components/Service/ServicePopup';
import RecuperarSenha from './routes/RecuperarSenha';
import React, { useState } from 'react';
import Moderador from './routes/Moderador/Moderador';
import Usuario from './components/Usuario/Usuario';

function App() {
  const [isServicePopupOpen, setIsServicePopupOpen] = useState(false); // Adiciona este estado para controlar a visibilidade do ServicePopup
  return (
    <>
       <Routes>
          <Route path="/" element={<Login />} />
          <Route path="home" element={<Home />} />
          <Route path="cadastro" element={<Cadastro />} />
          <Route path="recuperarsenha" element={<RecuperarSenha />} />
          <Route path="Usuario" element={<Usuario />} />
          <Route path="/Moderador/*" element={<Moderador />} />
          <Route path="service" element={<ServicePopup 
            isOpen={isServicePopupOpen} 
            toggleModal={() => setIsServicePopupOpen(!isServicePopupOpen)} />}  // Passa isOpen e toggleModal como props para ServicePopup 
          />
      </Routes>
    </>

  );
}

export default App;



