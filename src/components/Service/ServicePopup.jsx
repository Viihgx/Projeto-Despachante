// ServicePopup.jsx

import React, { useState } from "react";
import PropTypes from "prop-types";
import './Service.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import PlanCards from "../PlanCards/PlanCards";
import FileUpload from "../FileUpload/FileUpload";
import ConteudoPremium from "./ConteudoPremium";
import ConteudoBasico from "./ConteudoBasico";

const steps = ['Selecionar plano', 'Preencher informações', 'Enviar documento', 'Concluir'];

const ServicePopup = ({ isOpen, toggleModal }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');

  const handleCloseClick = () => {
    toggleModal();
    setActiveStep(0);
    setSelectedCard(null);
    setFullName('');
    setPassword('');
  };

  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFinish = () => {
    toggleModal();
    setActiveStep(0);
    setSelectedCard(null);
    setFullName('');
    setPassword('');
  };

  const handleCardSelect = (card) => {
    console.log("Card selecionado:", card); // Adicione esta linha
    setSelectedCard(card);
  };

  if (!isOpen) return null;

  return (
    <div className="service-popup-container">
      <div className="modal-1-overlay" onClick={handleCloseClick}>
        <div className="modal-1-modal" onClick={(e) => e.stopPropagation()}>
          <div>
            <ArrowBackIcon className="icon-retornar" sx={{cursor: 'pointer'}} onClick={handleCloseClick} />
            <h2 className="title-page-service" style={{color: 'black'}}>Serviço</h2>
          </div>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div className="popup-content">
            {activeStep === 0 && (
              <div>
                <PlanCards onSelect={handleCardSelect} />
              </div>
            )}
            {activeStep === 1 && (
            <>
              {selectedCard === "premium" && (
                <ConteudoPremium />
              )}
              {selectedCard === "basic" && (
                <ConteudoBasico />
              )}
            </>
            )}
            {activeStep === 2 && (
              <div>
                <FileUpload />
              </div>
            )}
            {activeStep === 3 && (
              <div>
                <button>Oi</button>
                <p>Conteúdo específico para o passo 4</p>
              </div>
            )}
          </div>
          <div className="steps-navigation">
            {activeStep > 0 && (
              <Button onClick={handlePreviousStep}>Voltar</Button>
            )}
            {activeStep < steps.length - 1 && (
              <Button onClick={handleNextStep}>Próximo</Button>
            )}
            {activeStep === steps.length - 1 && (
              <Button onClick={handleFinish}>Finalizar</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ServicePopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default ServicePopup;
