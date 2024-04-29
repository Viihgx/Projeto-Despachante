import './Home.css';
import Header from '../components/Header/Header';
import ImgCaminhoesTarde from '../assets/img/ImgCaminhoesTarde.jpg';
import Card from '../components/Card/Card';
import ServicePopup from '../components/Service/ServicePopup';
import React, { useState } from 'react';

function Home() {
   const [isServicePopupOpen, setIsServicePopupOpen] = useState(false);
   const toggleServicePopup = () => {
      setIsServicePopupOpen(!isServicePopupOpen);
  };

   return (
      <div className='container-main'>
         <Header />
         <div className="imagem-fullscreen">
         </div>
         <div className="container-img-text">
            <div className='text-main'>
               <div className="texto-superior">Conecte. Simplifique. Confie.</div>
               <div className="texto-sobreposicao">Facilitando o caminho dos seus documentos</div>
            </div>
            <div className='linha-horizontal'> <hr /> </div>
            <div className='btn-img'>
               <button className='btn-primario' onClick={(e) => { e.preventDefault(); toggleServicePopup(); }}>Solicitar agora</button>
            </div>
         </div>
         <div className='container-master'>
            <div className='text-sobre'>
               <h4 className='text-title'>Sobre a Empresa</h4>
               <p className='text-p'>O projeto de despachante é uma iniciativa liderada por um experiente profissional com 57 anos de idade e 35 anos de experiência como despachante. Com vasto conhecimento e expertise no ramo, esse despachante oferece uma ampla gama de serviços relacionados à documentação e trâmites burocráticos.
                  Com uma carreira de sucesso, o despachante possui um profundo entendimento dos procedimentos legais e administrativos necessários para lidar com questões como transferência de veículos, obtenção de licenças, regularização de documentos e outras demandas relacionadas.
                  Além de seu extenso conhecimento, o despachante valoriza a comunicação clara e eficiente com os clientes. Ele se esforça para explicar os detalhes de cada etapa do processo, garantindo que os clientes compreendam plenamente o que está acontecendo e se sintam confortáveis durante todo o procedimento.
                  O despachante também se destaca por sua eficiência e organização, garantindo que todos os documentos e formulários estejam em ordem e que os prazos sejam cumpridos de forma pontual. Sua vasta experiência permite que ele identifique possíveis obstáculos e os resolva de maneira ágil, evitando atrasos desnecessários.
                  Além disso, o despachante valoriza o atendimento personalizado, adaptando-se às necessidades individuais de cada cliente. Ele está disponível para responder a perguntas, fornecer orientações e oferecer soluções personalizadas, demonstrando um genuíno interesse em ajudar seus clientes a alcançarem seus objetivos.
                  Em resumo, o projeto de despachante liderado por esse profissional experiente e dedicado é uma opção confiável e eficiente para aqueles que buscam serviços de despachante. Com sua vasta experiência, conhecimento abrangente, habilidades de comunicação e compromisso com a satisfação do cliente, ele está preparado para fornecer soluções efetivas e simplificar processos burocráticos complexos.</p>
            </div>

            <div className='text-objetivo'>
               <h4 className='text-title'>Regularização Documental Simplificando</h4>
               <p className='text-p'>O trabalho do despachante documentalista tem como objetivo auxiliar indivíduos e empresas na regularização de documentos, simplificando processos burocráticos e garantindo a conformidade legal. Por meio de uma abordagem personalizada, eficiente e experiente, o projeto visa facilitar a obtenção e atualização de documentos necessários, evitando problemas legais e proporcionando tranquilidade aos clientes.</p>
               <img className='img-segunda' src={ImgCaminhoesTarde} alt="Caminhões" />
            </div>

         </div>
            <div className='title-container-cards'>
               <h4 className='text-title'>Nossos Serviços</h4>
            </div>
            <div className="cards-container">
               <div className="cards-container-main">
                  <Card />
               </div>
            </div>
            <ServicePopup isOpen={isServicePopupOpen} toggleModal={toggleServicePopup} />
      </div>

   );
}

export default Home;