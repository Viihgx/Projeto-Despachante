// require('dotenv').config(); 
import { createClient } from '@supabase/supabase-js';

// Configure o cliente Supabase
const supabaseUrl = 'https://zlzoirfwdhmwmesytvzl.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsem9pcmZ3ZGhtd21lc3l0dnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA1MzQxOTYsImV4cCI6MjAyNjExMDE5Nn0.QxDTeHLAzf_Re5gIdGo277zutfvxLyamc7xGemWzZ3M";
const supabase = createClient(supabaseUrl, supabaseKey);

// Defina a função cadastrarServico
async function cadastrarServico({ id_usuario, tipo_servico, forma_pagamento, status_servico, data_solicitacao, file_pdf }) {
  try {
    // Insira os dados do serviço na tabela servicoSolicitado
    const { data: servico, error } = await supabase
      .from('servicoSolicitado')
      .insert({
        id_usuario,
        tipo_servico,
        forma_pagamento,
        status_servico,
        data_solicitacao,
        file_pdf
      })
      .single();

    if (error) {
      console.error('Erro ao cadastrar serviço:', error);
      throw new Error('Erro ao cadastrar serviço');
    }

    return servico;
  } catch (error) {
    throw new Error('Erro ao cadastrar serviço: ' + error.message);
  }
}

export default cadastrarServico;



