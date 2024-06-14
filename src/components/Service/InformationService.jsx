import React, { useEffect } from "react";
import TextField from '@mui/material/TextField';
import { Typography } from "@mui/material";
import { Grid } from "@material-ui/core";

const InformationService = ({ informationData, setInformationData, setIsStepValid }) => {
    const { fullName, nameVeiculo, licensePlate } = informationData;

    const handleFullNameChange = (event) => {
        setInformationData(prevData => ({ ...prevData, fullName: event.target.value }));
    };

    const handleNameVeiculoChange = (event) => {
        setInformationData(prevData => ({ ...prevData, nameVeiculo: event.target.value }));
    };

    const handleLicensePlateChange = (event) => {
        let inputLicensePlate = event.target.value.replace(/[^a-zA-Z0-9-]/g, '');
        inputLicensePlate = inputLicensePlate.slice(0, 8);
        setInformationData(prevData => ({ ...prevData, licensePlate: inputLicensePlate.toUpperCase() }));
    };

    useEffect(() => {
        const isValid = fullName && nameVeiculo && licensePlate;
        setIsStepValid(isValid);
    }, [fullName, nameVeiculo, licensePlate, setIsStepValid]);

    return (
        <div style={{ marginBottom: "100px" }}>
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
                        value={nameVeiculo} 
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
