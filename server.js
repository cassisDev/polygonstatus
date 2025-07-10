require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve arquivos estáticos da raiz do projeto
app.use(express.static(__dirname));

// Rota da API
app.get('/api/polygon-transactions', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const contract = '0x7D1AfA7B718fb893dB30A3aDfCAE71313756922C';

    const apiKey = process.env.POLYGONSCAN_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ status: "0", message: "Chave da API não configurada" });
    }

    const url = 'https://polygonstatus.site/api/polygon-transactions';

    url.searchParams.append('module', 'account');
    url.searchParams.append('action', 'tokentx');
    url.searchParams.append('contractaddress', contract);
    url.searchParams.append('page', page);
    url.searchParams.append('offset', limit);
    url.searchParams.append('sort', 'desc');
    url.searchParams.append('apikey', apiKey);

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({ status: "0", message: "Erro ao consultar Polygonscan" });
    }

    return res.json({
      status: data.status,
      result: data.result || [],
    });
  } catch (error) {
    console.error('Erro no backend:', error);
    res.status(500).json({ status: "0", message: error.message });
  }
});

// Rota fallback para abrir o index.html direto
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
