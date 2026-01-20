const express = require("express");
const cors = require("cors");
const app = express();


require("dotenv").config(); // Carrega variáveis do arquivo .env
app.use(cors()); // Permite que o Frontend (React) acesse o Backend
app.use(express.json()); // Permite que o Backend entenda JSON

const PORT = process.env.PORT || 3001;

// Rota de Teste (Para saber se está funcionando)
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Inicia o Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
