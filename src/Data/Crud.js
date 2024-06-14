import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function cadastrarServico({ id_usuario, tipo_servico, forma_pagamento, status_servico, data_solicitacao, file_pdfs, nome_completo, placa_do_veiculo, apelido_do_veiculo }) {
  try {
    const { data, error } = await supabase
      .from('servicoSolicitado')
      .insert({
        id_usuario,
        tipo_servico,
        forma_pagamento,
        status_servico,
        data_solicitacao,
        file_pdfs,
        nome_completo,
        placa_do_veiculo,
        apelido_do_veiculo
      })
      .single();

    if (error) {
      console.error('Erro ao cadastrar serviço:', error);
      return { success: false, message: 'Erro ao cadastrar serviço' };
    }

    return { success: true, message: 'Serviço cadastrado com sucesso', data };
  } catch (error) {
    console.error('Erro ao cadastrar serviço:', error);
    return { success: false, message: 'Erro ao cadastrar serviço' };
  }
}

export default cadastrarServico;
