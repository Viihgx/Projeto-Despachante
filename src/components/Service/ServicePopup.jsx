import React from "react";
import PropTypes from "prop-types";
import './Service.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ServicePopup = ({ isOpen, toggleModal }) => {
  // Esta função será chamada quando o ícone de voltar for clicado
  const handleCloseClick = () => {
    toggleModal();
  };

  // Impede qualquer ação quando o overlay ou os inputs são clicados
  const handleStopPropagation = (e) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-1-overlay" onClick={handleStopPropagation}>
      <div className="modal-1-modal" onClick={handleStopPropagation}>
        <div>
          <ArrowBackIcon className="icon-retornar" sx={{cursor: 'pointer'}} onClick={handleCloseClick} />
          <h2>Serviço</h2>
          <h3>Try Hologram today</h3>
        </div>
        <form onClick={handleStopPropagation}>
          <div className="textbox">
            <span className="material-symbols-outlined">Nome Completo</span>
            <input type="email" placeholder="Email" />
          </div>
          <div className="textbox">
            <span className="material-symbols-outlined">senha</span>
            <input type="password" placeholder="Password" />
          </div>
          <div>
          <button  id="btn-enviar-pdf" className='btn-primario'>Enviar arquivo PDF</button>
          </div>
        </form>
        <p>sei oq sei oq</p>
      </div>
    </div>
  );
};

ServicePopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default ServicePopup;
