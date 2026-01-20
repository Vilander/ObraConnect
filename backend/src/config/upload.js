const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  // Onde salvar? Na pasta uploads na raiz do projeto
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  // Qual nome dar?
  filename: (req, file, cb) => {
    // Ex: imagem.jpg vira 123456789-imagem.jpg
    // Isso evita que duas pessoas enviem arquivos com mesmo nome e um sobrescreva o outro
    const nomeUnico = Date.now() + "-" + file.originalname;
    cb(null, nomeUnico);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
