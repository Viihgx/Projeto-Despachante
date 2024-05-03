import React from "react";
import PropTypes from "prop-types";
import PaymentIcon from '@mui/icons-material/Payment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel'; 

const PaymentForm = ({ fullName, setFullName, cpf, setCpf, paymentMethod, setPaymentMethod, installments, setInstallments }) => {
  return (
    <div style={{marginBottom:"25px"}}>
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
        <FormControl fullWidth> 
          <InputLabel id="payment-method-label">Selecione um método de pagamento</InputLabel>
          <Select
            labelId="payment-method-label" // Use labelId para conectar o InputLabel ao Select
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
          </Select>
        </FormControl>
      </div>
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
