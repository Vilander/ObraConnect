require("dotenv").config(); // Carrega variáveis do arquivo .env

const express = require("express");
const cors = require("cors");
const banco = require("./config/database");
const rotasAutenticacao = require("./routes/authRoutes");

const app = express();

app.use(cors()); // Permite que o Frontend (React) acesse o Backend
app.use(express.json()); // Permite que o Backend entenda JSON

// --- CONFIGURAÇÃO DA ROTA (NOVO) ---
// Tudo que for /api/auth/... vai para o arquivo de rotas
app.use('/api/auth', rotasAutenticacao);

const PORT = process.env.PORT || 3001;

// Rota de Teste (Para saber se está funcionando)
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// --- ROTA DE TESTE DO BANCO DE DADOS ---
app.get("/teste-banco", async (requisicao, resposta) => {
  try {
    // Tenta buscar as categorias (ajuste o nome da tabela se for diferente)
    // Usamos "const [linhas]" porque o mysql2 retorna [dados, definições]
    const [categorias] = await banco.query(
      "SELECT * FROM tb_categoria LIMIT 5",
    );

    resposta.status(200).json({
      mensagem: "Conexão com Banco de Dados realizada com sucesso!",
      total_encontrado: categorias.length,
      dados: categorias,
    });
  } catch (erro) {
    console.error("Erro ao conectar:", erro);
    resposta.status(500).json({
      mensagem: "Erro ao conectar no banco de dados",
      erro_detalhado: erro.message,
    });
  }
});

// Inicia o Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
