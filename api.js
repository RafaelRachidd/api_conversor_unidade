const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON no corpo da requisição (se necessário)
app.use(express.json());

// Tabela de conversão (usando o Metro como unidade base de comprimento)
const METRO_PARA = {
  metro: 1,
  quilometro: 0.001,
  centimetro: 100,
  milimetro: 1000,
  milha: 0.000621371,
  pe: 3.28084
};

// ROTA 1: GET /unidades -> Lista as unidades suportadas na aula
app.get('/unidades', (req, res) => {
  res.status(200).json({
    suportadas: Object.keys(METRO_PARA),
    exemplo_uso: "/converter?valor=100&de=metro&para=quilometro"
  });
});

// ROTA 2: GET /converter?valor=100&de=metro&para=quilometro
app.get('/converter', (req, res) => {
  const { valor, de, para } = req.query;

  // 1. Validação de presença dos parâmetros
  if (!valor || !de || !para) {
    return res.status(400).json({
      erro: "Parâmetros ausentes. Forneça 'valor', 'de' e 'para' na URL."
    });
  }

  // 2. Validação se o valor é um número
  const valorNumerico = parseFloat(valor);
  if (isNaN(valorNumerico)) {
    return res.status(400).json({
      erro: "O parâmetro 'valor' deve ser um número válido."
    });
  }

  // 3. Validação das unidades suportadas
  const deMinusculo = de.toLowerCase();
  const paraMinusculo = para.toLowerCase();

  if (!METRO_PARA[deMinusculo] || !METRO_PARA[paraMinusculo]) {
    return res.status(400).json({
      erro: "Unidade não suportada.",
      unidadesValidas: Object.keys(METRO_PARA)
    });
  }

  // 4. Lógica de conversão: Converte 'de' para metros, depois de metros para 'para'
  const valorEmMetros = valorNumerico / METRO_PARA[deMinusculo];
  const resultado = valorEmMetros * METRO_PARA[paraMinusculo];

  // 5. Retorno da resposta em JSON
  res.status(200).json({
    origem: { valor: valorNumerico, unidade: deMinusculo },
    destino: { valor: Number(resultado.toFixed(4)), unidade: paraMinusculo }
  });
});

// Tratamento para rotas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
