const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conecta ao banco de dados (cria o arquivo se não existir)
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    // 1. Cria a tabela de usuários
    db.run("CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, senha TEXT)");
    
    // 2. Cria a tabela da agenda
    db.run(`CREATE TABLE IF NOT EXISTS agenda (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT,
        descricao TEXT,
        data TEXT,
        hora TEXT
    )`);
    
    // 3. INSERE O USUÁRIO DE TESTE
    // Usamos INSERT OR IGNORE para não dar erro de "ID duplicado" toda vez que você reiniciar o server
    db.run("INSERT OR IGNORE INTO usuarios (id, nome, email, senha) VALUES (1, 'Joao', 'joao@teste.com', '123')");
    
    console.log("✅ Banco de dados e tabelas prontos.");
    console.log("👤 Usuário padrão: joao@teste.com | Senha: 123");
});

// --- ROTA DE LOGIN ---
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    console.log(`Tentativa de login: ${email}`);

    db.get("SELECT * FROM usuarios WHERE email = ? AND senha = ?", [email, senha], (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Erro no servidor" });
        }
        if (row) {
            // Enviamos 'auth: true' porque é isso que o seu front-end checa na imagem 7b743a
            res.json({ auth: true, user: row });
        } else {
            res.status(401).json({ auth: false, message: "Acesso negado. Verifique e-mail e senha." });
        }
    });
});

// --- ROTAS DA AGENDA ---

// Listar eventos
app.get('/agenda', (req, res) => {
    db.all("SELECT * FROM agenda ORDER BY data ASC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Cadastrar na agenda
app.post('/agenda', (req, res) => {
    const { titulo, descricao, data, hora } = req.body;
    db.run("INSERT INTO agenda (titulo, descricao, data, hora) VALUES (?, ?, ?, ?)", 
    [titulo, descricao, data, hora], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

// Inicia o servidor em todas as interfaces de rede para o celular acessar
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📡 Para o celular, use o IP que você viu no ipconfig:3000`);
});