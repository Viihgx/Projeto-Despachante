import image from '../../assets/img/IconPlacamento.png'
import './Card.css';

const mock = [
  {
    "title": "Primeiro Emplacamento",
    "descricao": "Após a compra de um veículo novo, realizar o primeiro emplacamento é o último passo para regularizar seu veículo para poder andar com liberdade e segurança."
  },
  {
    "title": "Placa Mercosul",
    "descricao": "Se houver perda, roubo ou danos a sua placa, seja a antiga ou as novas Mercosul, podemos resolver esse problema."
  },
  {
    "title": "Segunda via",
    "descricao": "Perda, roubo ou rasura de documentação ou transferência podem acontecer, porém, não precisa se preocupar, é possível emitir uma segunda via."
  },
  {
    "title": "Transferência de veículos",
    "descricao": "Na hora de comprar ou vender um veículo usado, ou de mudar o local de registro do veículo, será necessário realizar a transferência de veículo."
  },
]

function Card() {
  return (
    <div className='container-cards'>
    {mock.map(({ title, descricao }, index) => (
      <div key={index} className="card-home">
         <div className="circle">
          <img className='img-icon' src={image} alt={title} />
        </div>
        <div className="card-conteudo">
          <h2 className='card-title'>{title}</h2>
          <p className='text-p'>{descricao}</p>
        </div>
      </div>
    ))}
  </div>
);
}

  export default Card;
