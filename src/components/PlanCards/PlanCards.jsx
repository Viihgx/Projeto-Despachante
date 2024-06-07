import React, { useState, useEffect } from 'react';
import './PlanCards.css';

function PlanCards({ onSelect, selectedPlan }) {
  const [localSelectedPlan, setLocalSelectedPlan] = useState(selectedPlan);

  useEffect(() => {
    setLocalSelectedPlan(selectedPlan);
  }, [selectedPlan]);

  const handleSelectPlan = (planId) => {
    setLocalSelectedPlan(planId);
    onSelect(planId); // Chama a função onSelect passando o plano selecionado
  };

  return (
    <div className="plan-cards-container">
      <div id='card1' className={`plan-card ${localSelectedPlan === 'premium' ? 'selected' : ''}`} onClick={() => handleSelectPlan('premium')}>
        {localSelectedPlan === 'premium' && <div className="selection-indicator"></div>}
        <h2 className="plan-title">Plano Premium</h2>
        <p className="plan-description">Descrição detalhada do Plano Premium. Inclui recursos avançados e suporte prioritário.</p>
        <p className="plan-price">$99/mês</p>
      </div>
      <div id='card2' className={`plan-card ${localSelectedPlan === 'basic' ? 'selected' : ''}`} onClick={() => handleSelectPlan('basic')}>
        {localSelectedPlan === 'basic' && <div className="selection-indicator"></div>}
        <h2 className="plan-title">Plano Básico</h2>
        <p className="plan-description">Descrição detalhada do Plano Básico. Inclui recursos essenciais e suporte padrão.</p>
        <p className="plan-price">$49/mês</p>
      </div>
    </div>
  );
}

export default PlanCards;
