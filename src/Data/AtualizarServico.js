import axios from 'axios';

const atualizarStatusServico = async (id, novoStatus) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`http://localhost:3000/moderador/servicos/${id}`, { status: novoStatus }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Resposta da API:', response.data);
    // Lógica para atualizar o estado dos serviços no front-end, se necessário
  } catch (error) {
    console.error('Erro ao atualizar o status do serviço:', error);
    // Lógica para lidar com erros, se necessário
  }
};

export default atualizarStatusServico;
