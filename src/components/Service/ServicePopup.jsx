import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import './Service.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import PlanCards from "../PlanCards/PlanCards";
import FileUpload from "../FileUpload/FileUpload";
import CardService from "../Cards/CardService/CardService";
import InformationService from "./InformationService";
import PaymentForm from "./PaymentForm";
import { cadastrarPagamento, cadastrarServicoSolicitado } from "../../Data/database";

const steps = ['Selecionar Serviço', 'Preencher informações', 'Enviar documento', 'Concluir'];

const ServicePopup = ({ isOpen, toggleModal, usuarioId }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [installments, setInstallments] = useState(1);
  const [isStepValid, setIsStepValid] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [isPlanSelected, setIsPlanSelected] = useState(false);
  const [stepData, setStepData] = useState({
    0: { selectedCard: null }, // Dados da primeira etapa
    1: { fullName: '', cpf: '', paymentMethod: '', installments: 1 }, // Dados da segunda etapa
    2: { isFileSelected: false }, // Dados da terceira etapa
    3: { selectedPlan: null } // Dados da quarta etapa
  });
  

  const handleCloseClick = () => {
    toggleModal();
    setActiveStep(0);
    setSelectedCard(null);
    setFullName('');
    setCpf('');
    setPaymentMethod('');
    setInstallments(1);
    setIsFileSelected(false);
    setIsPlanSelected(false);
  };

  const handleNextStep = () => {
    if (isStepValid) {
      setActiveStep((prevStep) => prevStep + 1);
      validateStep(activeStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
    validateStep(activeStep - 1);
  };

  const handleFinish = async () => {
    toggleModal();
    setActiveStep(0);
    setSelectedCard(null);
    setFullName('');
    setCpf('');
    setPaymentMethod('');
    setInstallments(1);
    setIsFileSelected(false);
    setIsPlanSelected(false);

    const detalhesPagamento = {
      nomeCompleto: fullName,
      cpf,
      formaPagamento: paymentMethod,
      parcelas: installments
    };
    const resultado = await cadastrarPagamento(detalhesPagamento);
    if (resultado.success) {
      console.log("Detalhes do pagamento cadastrados com sucesso!");
  
    } else {
      console.error("Erro ao cadastrar detalhes do pagamento:", resultado.message);

    }
  };

  const handleCardSelect = async (card) => {
    setSelectedCard(card);
    setStepData((prevData) => ({
      ...prevData,
      0: { selectedCard: card }
    }));
  };
  
  const handlePlanSelect = (planId) => {
    setStepData((prevData) => ({
      ...prevData,
      3: { selectedPlan: planId }
    }));
  };
  
  const handleFileSelect = (file) => {
    setStepData((prevData) => ({
      ...prevData,
      2: { isFileSelected: file !== null }
    }));
  };
  
  

  const validateStep = (step) => {
    switch (step) {
      case 0:
        setIsStepValid(stepData[0].selectedCard !== null);
        break;
      case 1:
        setIsStepValid(
          stepData[1].fullName !== '' &&
          stepData[1].cpf !== '' &&
          stepData[1].paymentMethod !== ''
        );
        break;
      case 2:
        setIsStepValid(stepData[2].isFileSelected);
        break;
      case 3:
        setIsStepValid(stepData[3].selectedPlan !== null);
        break;
      default:
        setIsStepValid(true);
        break;
    }
  };
  
  
  useEffect(() => {
    validateStep(activeStep);
    console.log("isFileSelected:", isFileSelected); // log para acompanhar o estado isFileSelected
  }, [selectedCard, fullName, cpf, paymentMethod, isFileSelected]); 
  

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
            {/* PRIMEIRA ETAPA */}
            {activeStep === 0 && (
              <div>
                <CardService onSelect={handleCardSelect} />
              </div>
            )}
            {/* SEGUNDA ETAPA */}
            {activeStep === 1 && (
                <InformationService setIsStepValid={setIsStepValid} />
            )}
            {/* TERCEIRA ETAPA */}
            {activeStep === 2 && (
              <>
                 {selectedCard === "primeiro-emplacamento" && (
                  <div className="container-file-upload">
                    <h1 className="title-service-select">Primeiro Emplacamento</h1>
                    <h3 className="title-service-select">Documentos Necessários:</h3>
                    <ul>
                      <li>Nota fiscal da compra.</li>
                      <li>Cópia da CNH ou identidade.</li>
                      <li>CPF do nome do remetente.</li>
                    </ul>
                    <FileUpload onFileSelect={handleFileSelect} />
                  </div>
                )}
              </>
            )}
            {activeStep === 2 && (
              <>
                 {selectedCard === "placa-mercosul" && (
                   <div className="container-file-upload">
                    <h1 className="title-service-select">Placa Mercosul</h1>
                    <h3 className="title-service-select">Documentos Necessários:</h3>
                    <ul>
                      <li>CRLV do veículo.</li>
                      <li>Cópia da CNH ou identidade.</li>
                      <li>CPF do proprietário do veículo. </li>
                      <li>Recibo de compra e venda (caso a placa for modelo antigo). </li>
                      <li>B.O de perda da placa (caso ela tenha sido extraviada). </li>
                    </ul>
                   <FileUpload onFileSelect={handleFileSelect} />
                 </div>
                )}
              </>
            )}
            {activeStep === 2 && (
              <>
                 {selectedCard === "segunda-via" && (
                  <div className="container-file-upload">
                  <h1 className="title-service-select">Segunda Via</h1>
                  <h3 className="title-service-select">Documentos Necessários:</h3>
                  <ul>
                    <li>Requisição de segunda via assinada e reconhecida.</li>
                    <li>Cópia da CNH ou identidade.</li>
                    <li>CPF do proprietário do veículo. </li>
                    <li>B.O de perda do CRV. </li>
                  </ul>
                 <FileUpload onFileSelect={handleFileSelect} />
               </div>
                )}
              </>
            )}
            {activeStep === 2 && (
              <>
                 {selectedCard === "transferencia-veicular" && (
                   <div className="container-file-upload">
                   <h1 className="title-service-select">Transferencia Veicular</h1>
                   <h3 className="title-service-select">Documentos Necessários:</h3>
                   <ul>
                     <li>ATPV-e ou Recibo de compra e venda assinado e reconhecido.</li>
                     <li>Cópia da CNH ou identidade .</li>
                     <li>CPF do comprador do veículo. </li>
                   </ul>
                  <FileUpload onFileSelect={handleFileSelect} />
                </div>
                )}
              </>
            )}
            {/* QUARTA ETAPA */}
            {activeStep === 3 && (
              <div>
                <PlanCards onSelect={handlePlanSelect}/>
                <PaymentForm
                  fullName={fullName}
                  setFullName={setFullName}
                  cpf={cpf}
                  setCpf={setCpf}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  installments={installments}
                  setInstallments={setInstallments}
                />
              </div>
            )}
          </div>
          {/* NAVEÇÃO / BUTTONS */}
          <div className="steps-navigation">
            {activeStep > 0 && (
              <Button onClick={handlePreviousStep}>Voltar</Button>
            )}
            {activeStep < steps.length - 1 && (
              <Button onClick={handleNextStep} disabled={!isStepValid}>Próximo</Button>
            )}
            {activeStep === steps.length - 1 && (
              <Button onClick={handleFinish} disabled={!isStepValid}>Finalizar</Button>
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
