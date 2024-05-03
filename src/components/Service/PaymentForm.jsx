import React from "react";
import PropTypes from "prop-types";
import PaymentIcon from '@mui/icons-material/Payment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { cadastrarPagamento } from "../../Data/database"; 

const PaymentForm = ({ fullName, setFullName, cpf, setCpf, paymentMethod, setPaymentMethod, installments, setInstallments }) => {
  const handleFinishPayment = async () => {
    // Reúna os detalhes do pagamento
    const detalhesPagamento = {
      nomeCompleto: fullName,
      cpf,
      formaPagamento: paymentMethod,
      parcelas: installments
    };

    // Chame a função para cadastrar os detalhes do pagamento
    const resultado = await cadastrarPagamento(detalhesPagamento);
    if (resultado.success) {
      console.log("Detalhes do pagamento cadastrados com sucesso!");
      // Execute ações adicionais, se necessário
    } else {
      console.error("Erro ao cadastrar detalhes do pagamento:", resultado.message);
      // Trate o erro de acordo com as necessidades do aplicativo
    }
  };

  return (
    <div>
      <h3>Informações de Pagamento</h3>
      <TextField
        label="Nome Completo"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        fullWidth
      />
      <TextField
        label="CPF"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
        fullWidth
      />
      <div>
        <Select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          fullWidth
        >
          <MenuItem value="boleto">
            <PaymentIcon /> Boleto
          </MenuItem>
          <MenuItem value="debito">
            <CreditCardIcon /> Cartão de Débito
          </MenuItem>
          <MenuItem value="credito">
            <CreditCardIcon /> Cartão de Crédito
          </MenuItem>
          <MenuItem value="Pix">
            <CreditCardIcon /> Pix
          </MenuItem>
          {/* Adicione mais opções de pagamento conforme necessário */}
        </Select>
      </div>
      <button onClick={handleFinishPayment}>Concluir Pagamento</button>
    </div>
  );
};

PaymentForm.propTypes = {
  fullName: PropTypes.string.isRequired,
  setFullName: PropTypes.func.isRequired,
  cpf: PropTypes.string.isRequired,
  setCpf: PropTypes.func.isRequired,
  paymentMethod: PropTypes.string.isRequired,
  setPaymentMethod: PropTypes.func.isRequired,
  installments: PropTypes.number.isRequired,
  setInstallments: PropTypes.func.isRequired,
};

export default PaymentForm;
