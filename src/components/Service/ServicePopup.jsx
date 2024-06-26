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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const steps = ['Selecionar Serviço', 'Preencher informações', 'Enviar documento', 'Concluir'];

function ServicePopup({ isOpen, toggleModal, usuarioId }) {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [informationData, setInformationData] = useState({
    fullName: '',
    nameVeiculo: '',
    licensePlate: ''
  });
  const [paymentData, setPaymentData] = useState({
    fullName: '',
    cpf: '',
    paymentMethod: '',
    installments: 1
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isStepValid, setIsStepValid] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [stepData, setStepData] = useState({
    0: { selectedCard: null },
    2: { isFileSelected: false, file_pdfs: [] },
    3: { selectedPlan: null }
  });

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const handleCloseClick = () => {
    toggleModal();
    resetState();
  };

  const resetState = () => {
    setActiveStep(0);
    setSelectedCard(null);
    setInformationData({
      fullName: '',
      nameVeiculo: '',
      licensePlate: ''
    });
    setPaymentData({
      fullName: '',
      cpf: '',
      paymentMethod: '',
      installments: 1
    });
    setSelectedFiles([]);
    setStepData({
      0: { selectedCard: null },
      2: { isFileSelected: false, file_pdfs: [] },
      3: { selectedPlan: null }
    });
    setErrorMessage('');
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
    if (selectedFiles.length === 0) {
      setErrorMessage("Por favor, selecione um ou mais arquivos PDF antes de finalizar.");
      return;
    }

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('pdfs', file);
      });

      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:3000/upload-pdf', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro ao enviar arquivos:', errorData.error);
        setErrorMessage('Erro ao enviar arquivos: ' + errorData.error);
        return;
      }

      const { urls } = await response.json();
      console.log('Arquivos enviados com sucesso:', urls);

      // Agora cadastre o serviço com as URLs dos arquivos e novas informações
      const cadastroResponse = await cadastrarServico({
        id_usuario: usuarioId,
        tipo_servico: selectedCard,
        forma_pagamento: paymentData.paymentMethod,
        status_servico: 'Pendente',
        data_solicitacao: new Date().toISOString(),
        file_pdfs: urls,
        nome_completo: informationData.fullName,
        placa_do_veiculo: informationData.licensePlate,
        apelido_do_veiculo: informationData.nameVeiculo
      });

      if (!cadastroResponse.success) {
        console.error('Erro ao cadastrar serviço:', cadastroResponse.message);
        setErrorMessage('Erro ao cadastrar serviço: ' + cadastroResponse.message);
        return;
      }

      console.log('Serviço cadastrado com sucesso:', cadastroResponse);
      toast.success('Serviço cadastrado com sucesso!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      handleCloseClick();
    } catch (error) {
      console.error("Erro ao finalizar o serviço:", error);
      setErrorMessage("Erro ao finalizar o serviço: " + error.message);
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

  const handleFileSelect = async (files) => {
    setSelectedFiles(files);
    setStepData((prevData) => ({
      ...prevData,
      2: { isFileSelected: true, file_pdfs: files }
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        setIsStepValid(stepData[0].selectedCard !== null);
        break;
      case 1:
        setIsStepValid(
          informationData.fullName !== '' &&
          informationData.nameVeiculo !== '' &&
          informationData.licensePlate !== ''
        );
        break;
      case 2:
        setIsStepValid(selectedFiles.length > 0);
        break;
      case 3:
        setIsStepValid(paymentData.paymentMethod !== '');
        break;
      default:
        setIsStepValid(true);
        break;
    }
  };

  useEffect(() => {
    validateStep(activeStep);
  }, [selectedCard, informationData, paymentData, selectedFiles, activeStep]);

  if (!isOpen) return null;

  return (
    <div className="service-popup-container">
      <div className="modal-1-overlay">
        <div className="modal-1-modal" onClick={(e) => e.stopPropagation()}>
          <div>
            <ArrowBackIcon className="icon-retornar" sx={{ cursor: 'pointer' }} onClick={handleCloseClick} />
            <h2 className="title-page-service" style={{ color: 'black' }}>Serviço</h2>
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
              <CardService onSelect={handleCardSelect} selectedCard={stepData[0].selectedCard} />
            )}
            {activeStep === 1 && (
              <InformationService
                informationData={informationData}
                setInformationData={setInformationData}
                setIsStepValid={setIsStepValid}
              />
            )}
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
                    <FileUpload
                      onFileSelect={handleFileSelect}
                      selectedFiles={stepData[2].file_pdfs}
                    />
                  </div>
                )}
                {selectedCard === "placa-mercosul" && (
                  <div className="container-file-upload">
                    <h1 className="title-service-select">Placa Mercosul</h1>
                    <h3 className="title-service-select">Documentos Necessários:</h3>
                    <ul>
                      <li>CRLV do veículo.</li>
                      <li>Cópia da CNH ou identidade.</li>
                      <li>CPF do proprietário do veículo.</li>
                      <li>Recibo de compra e venda (caso a placa for modelo antigo).</li>
                      <li>B.O de perda da placa (caso ela tenha sido extraviada).</li>
                    </ul>
                    <FileUpload
                      onFileSelect={handleFileSelect}
                      selectedFiles={stepData[2].file_pdfs}
                    />
                  </div>
                )}
                {selectedCard === "segunda-via" && (
                  <div className="container-file-upload">
                    <h1 className="title-service-select">Segunda Via</h1>
                    <h3 className="title-service-select">Documentos Necessários:</h3>
                    <ul>
                      <li>Requisição de segunda via assinada e reconhecida.</li>
                      <li>Cópia da CNH ou identidade.</li>
                      <li>CPF do proprietário do veículo.</li>
                      <li>B.O de perda do CRV.</li>
                    </ul>
                    <FileUpload
                      onFileSelect={handleFileSelect}
                      selectedFiles={stepData[2].file_pdfs}
                    />
                  </div>
                )}
                {selectedCard === "transferencia-veicular" && (
                  <div className="container-file-upload">
                    <h1 className="title-service-select">Transferencia Veicular</h1>
                    <h3 className="title-service-select">Documentos Necessários:</h3>
                    <ul>
                      <li>ATPV-e ou Recibo de compra e venda assinado e reconhecido.</li>
                      <li>Cópia da CNH ou identidade.</li>
                      <li>CPF do comprador do veículo.</li>
                    </ul>
                    <FileUpload
                      onFileSelect={handleFileSelect}
                      selectedFiles={stepData[2].file_pdfs}
                    />
                  </div>
                )}
              </>
            )}
            {activeStep === 3 && (
              <div>
                <PlanCards onSelect={handlePlanSelect} selectedPlan={stepData[3].selectedPlan} />
                <PaymentForm
                  fullName={paymentData.fullName}
                  setFullName={(value) => setPaymentData({ ...paymentData, fullName: value })}
                  cpf={paymentData.cpf}
                  setCpf={(value) => setPaymentData({ ...paymentData, cpf: value })}
                  paymentMethod={paymentData.paymentMethod}
                  setPaymentMethod={(value) => setPaymentData({ ...paymentData, paymentMethod: value })}
                  installments={paymentData.installments}
                  setInstallments={(value) => setPaymentData({ ...paymentData, installments: value })}
                />
              </div>
            )}
          </div>
          {errorMessage && (
            <div className="error-message">
              <p>{errorMessage}</p>
              <Button onClick={() => setErrorMessage('')}>Fechar</Button>
            </div>
          )}
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
}

ServicePopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  usuarioId: PropTypes.number,
};

export default ServicePopup;
