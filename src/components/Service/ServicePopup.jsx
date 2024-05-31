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
import cadastrarServico from '../../Data/Crud'; 

const steps = ['Selecionar Serviço', 'Preencher informações', 'Enviar documento', 'Concluir'];

function ServicePopup({ isOpen, toggleModal, usuarioId }) {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [installments, setInstallments] = useState(1);
  const [isStepValid, setIsStepValid] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPlanSelected, setIsPlanSelected] = useState(false);
  const [stepData, setStepData] = useState({
      0: { selectedCard: null },
      1: { fullName: '', cpf: '', paymentMethod: '', installments: 1 },
      2: { isFileSelected: false, file_pdf: null }, // Inicializa o estado do arquivo com null
      3: { selectedPlan: null }
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

    // Verifica se a URL do arquivo PDF está disponível no estado
    const filePdfUrl = stepData[2]?.file_pdf;

    const servico = {
        id_usuario: usuarioId,
        tipo_servico: selectedCard,
        forma_pagamento: paymentMethod,
        status_servico: 'pendente',
        data_solicitacao: new Date().toISOString(),
        file_pdf: filePdfUrl // Usa a URL do arquivo PDF
    };

    const resultadoCadastro = await cadastrarServico(servico);
    if (resultadoCadastro.success) {
        console.log("Serviço cadastrado com sucesso!");
    } else {
        console.error("Erro ao cadastrar serviço:", resultadoCadastro.message);
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

  const handleFileSelect = async (file) => {
  try {
    const formData = new FormData();
    formData.append('pdf', file);

    // Obtenha o token JWT do localStorage
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:3000/upload-pdf', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // Inclua o token JWT no cabeçalho de autorização
      },
      body: formData
    });

    if (response.ok) {
      const { url } = await response.json(); // Extrai a URL do PDF do corpo da resposta
      console.log('Arquivo enviado com sucesso:', url);

      // Atualize o estado com a URL do arquivo retornado pelo backend
      setStepData((prevData) => ({
        ...prevData,
        2: { isFileSelected: true, file_pdf: url } // Armazena a URL no estado file_pdf
      }));
      setIsFileSelected(true);
    } else {
      const errorData = await response.json();
      console.error('Erro ao enviar arquivo:', errorData.error);
      setIsFileSelected(false);
    }
  } catch (error) {
    console.error('Erro ao enviar arquivo:', error);
    setIsFileSelected(false);
  }
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
        setIsStepValid(isFileSelected);
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
