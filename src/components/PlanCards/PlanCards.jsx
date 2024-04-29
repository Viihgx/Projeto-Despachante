import React, { useState } from 'react';
import './PlanCards.css';

function PlanCards() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <div className="plan-cards-container">
      <div className={`plan-card ${selectedPlan === 'premium' ? 'selected' : ''}`} onClick={() => handleSelectPlan('premium')}>
        {selectedPlan === 'premium' && <div className="selection-indicator"></div>}
        <h2 className="plan-title">Plano Premium</h2>
        <p className="plan-description">Descrição detalhada do Plano Premium. Inclui recursos avançados e suporte prioritário.</p>
        <p className="plan-price">$99/mês</p>
      </div>
      <div className={`plan-card ${selectedPlan === 'basic' ? 'selected' : ''}`} onClick={() => handleSelectPlan('basic')}>
        {selectedPlan === 'basic' && <div className="selection-indicator"></div>}
        <h2 className="plan-title">Plano Básico</h2>
        <p className="plan-description">Descrição detalhada do Plano Básico. Inclui recursos essenciais e suporte padrão.</p>
        <p className="plan-price">$49/mês</p>
      </div>
    </div>
  );
}

export default PlanCards;
