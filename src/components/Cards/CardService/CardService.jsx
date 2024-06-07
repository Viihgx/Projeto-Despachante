import React, { useState, useEffect } from 'react';
import './CardService.css';
import { Grid } from '@material-ui/core';

function CardService({ onSelect, selectedCard }) {
  const [selectedPlan, setSelectedPlan] = useState(selectedCard);

  useEffect(() => {
    setSelectedPlan(selectedCard);
  }, [selectedCard]);

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    onSelect(planId); // Chama a função onSelect passando o plano selecionado
  };

  return (
    <div className="cards-service-container">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <div id='card1' className={`card-service ${selectedPlan === 'primeiro-emplacamento' ? 'selected' : ''}`} onClick={() => handleSelectPlan('primeiro-emplacamento')}>
            {selectedPlan === 'primeiro-emplacamento' && <div className="selection-indicator"></div>}
            <h2 className="title-service">Primeiro Emplacamento</h2>
            <p className="description-service">
              • Nota fiscal da compra <br/> 
              • Cópia da CNH ou identidade <br/>  
              • CPF do nome do remetente
            </p>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div id='card2' className={`card-service ${selectedPlan === 'placa-mercosul' ? 'selected' : ''}`} onClick={() => handleSelectPlan('placa-mercosul')}>
            {selectedPlan === 'placa-mercosul' && <div className="selection-indicator"></div>}
            <h2 className="title-service">Placa Mercosul</h2>
            <p className="description-service">
              • CRLV do veículo <br/>
              • Cópia da CNH ou identidade <br/>
              • CPF do proprietário do veículo <br/>
              • Recibo de compra e venda (caso a placa for modelo antigo) <br/>
              • B.O de perda da placa (caso ela tenha sido extraviada) <br/>
            </p>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div id='card3' className={`card-service ${selectedPlan === 'segunda-via' ? 'selected' : ''}`} onClick={() => handleSelectPlan('segunda-via')}>
            {selectedPlan === 'segunda-via' && <div className="selection-indicator"></div>}
            <h2 className="title-service">Segunda Via</h2>
            <p className="description-service">
              • Requisição de segunda via assinada e reconhecida <br/>
              • Cópia da CNH ou identidade <br/>
              • CPF do proprietário do veículo <br/>
              • B.O de perda do CRV <br/>
            </p>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div id='card4' className={`card-service ${selectedPlan === 'transferencia-veicular' ? 'selected' : ''}`} onClick={() => handleSelectPlan('transferencia-veicular')}>
            {selectedPlan === 'transferencia-veicular' && <div className="selection-indicator"></div>}
            <h2 className="title-service">Transferência Veicular</h2>
            <p className="description-service">
              • ATPV-e ou Recibo de compra e venda assinado e reconhecido  <br/>
              • Cópia da CNH ou identidade <br/>
              • CPF do comprador do veículo <br/>
            </p>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default CardService;
