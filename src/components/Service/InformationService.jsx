import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import { Typography } from "@mui/material";
import { Grade } from "@mui/icons-material";
import { Grid } from "@material-ui/core";

const InformationService = () => {
    const [fullName, setFullName] = useState('');
    const [NameVeiculo, setNameVeiculo] = useState('');
    const [cpf, setCPF] = useState('');
    const [licensePlate, setLicensePlate] = useState('');

    const handleFullNameChange = (event) => {
        setFullName(event.target.value);
    };

    const handleNameVeiculoChange = (event) => {
        setNameVeiculo(event.target.value);
    };

    const handleCPFChange = (event) => {
        let inputCPF = event.target.value;
        // Remove qualquer caractere que não seja número
        inputCPF = inputCPF.replace(/\D/g, '');
        // Limita a quantidade de caracteres para o formato de CPF
        inputCPF = inputCPF.slice(0, 11);
        // Adiciona os pontos e traço no formato do CPF
        inputCPF = inputCPF.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        // Atualiza o estado do CPF
        setCPF(inputCPF);
    };

    const handleLicensePlateChange = (event) => {
        // Apenas permite letras, números e traço para a placa
        let inputLicensePlate = event.target.value.replace(/[^a-zA-Z0-9-]/g, '');
        // Limita a quantidade de caracteres para 8 (placa padrão Mercosul)
        inputLicensePlate = inputLicensePlate.slice(0, 8);
        // Atualiza o estado da placa
        setLicensePlate(inputLicensePlate.toUpperCase()); // Transforma em maiúsculas
    };

    return ( 
        <div style={{marginBottom:"100px"}}>
          <Grid container spacing={2}>
          <Grid item xs={12}>
          <Typography variant="h6" color="black" marginTop="40px" display="flex" justifyContent="center">Preencha as informações abaixo:</Typography>
            <TextField 
                label="Nome Completo" 
                value={fullName} 
                onChange={handleFullNameChange} 
                fullWidth
                margin="normal" 
            />
            </Grid>
            <Grid item xs={6}>
            <TextField 
                label="CPF" 
                value={cpf} 
                onChange={handleCPFChange} 
                fullWidth
                margin="normal" 
            />
             </Grid>
             <Grid item xs={6}>
            <TextField 
                label="Placa do Carro (Mercosul)" 
                value={licensePlate} 
                onChange={handleLicensePlateChange} 
                fullWidth
                margin="normal" 
            />
            </Grid>
             <Grid item xs={12}>
             <TextField 
                label="Nome do veiculo" 
                value={NameVeiculo} 
                onChange={handleNameVeiculoChange} 
                fullWidth
                margin="normal" 
            />
            </Grid>
          </Grid>
        </div>
    );
};

export default InformationService;
