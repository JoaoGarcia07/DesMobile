const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = "chave_mestra_desbravadores";

let db;
(async () => {
    // Cria o banco de dados automaticamente na pasta backend
    db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            email TEXT UNIQUE,
            senha TEXT
        )
    `);
    console.log("✅ Banco de Dados SQLite pronto para o combate!");
})();

// CÓDIGO TEMPORÁRIO PARA CRIAR O USUÁRIO JOÃO
setTimeout(async () => {
    const senhaHash = await bcrypt.hash('123', 10);
    try {
        await db.run('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', ['Joao', 'joao@teste.com', senhaHash]);
        console.log("👤 Usuário de teste criado com sucesso!");
    } catch (e) {
        console.log("ℹ️ Usuário já existe ou erro ao criar.");
    }
}, 2000);

// ROTA PARA CADASTRAR (Criei essa para você usar agora)
app.post('/register', async (req, res) => {
    const { nome, email, senha } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);
    try {
        await db.run('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senhaHash]);
        res.json({ success: true, message: "Usuário criado!" });
    } catch (e) {
        res.status(400).json({ message: "Erro: E-mail já existe." });
    }
});

// ROTA PARA LOGIN (O que o seu App vai usar)
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    const user = await db.get('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (user && await bcrypt.compare(senha, user.senha)) {
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ auth: true, token, nome: user.nome });
    } else {
        res.status(401).json({ message: "E-mail ou senha inválidos" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));