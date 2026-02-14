const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Essencial para evitar erros de bloqueio no navegador

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, senha TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS agenda (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT, descricao TEXT, data TEXT, hora TEXT)");
    console.log("✅ Banco de dados pronto.");
});

// --- NOVAS ROTAS PARA A HOME ---

app.get('/api/home', (req, res) => {
    res.json({
        unidade: "Unidade Águia",
        desbravador: "João",
        atividadesPendentes: 3
    });
});

// --- ROTA DE RECUPERAÇÃO DE SENHA ---

app.post('/recuperar-senha', (req, res) => {
    const { email } = req.body;
    console.log(`📩 Pedido de recuperação recebido para: ${email}`);
    
    // Aqui no futuro você integrará com um serviço de e-mail (Nodemailer, etc)
    // Por enquanto, apenas confirmamos o recebimento
    res.json({ success: true, message: "Pedido recebido pelo servidor." });
});

// --- ROTAS EXISTENTES ---

app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    db.get("SELECT * FROM usuarios WHERE email = ? AND senha = ?", [email, senha], (err, row) => {
        if (row) {
            console.log(`🔑 Login realizado: ${email}`);
            res.json({ auth: true, user: row });
        } else {
            res.status(401).json({ auth: false, message: "Acesso negado." });
        }
    });
});

app.post('/usuarios', (req, res) => {
    const { nome, email, senha } = req.body;
    db.run("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", [nome, email, senha], function(err) {
        if (err) return res.status(500).json({ message: "Erro ao cadastrar." });
        console.log(`👤 Novo usuário cadastrado: ${email}`);
        res.status(201).json({ success: true });
    });
});

app.get('/agenda', (req, res) => {
    db.all("SELECT * FROM agenda ORDER BY data ASC", (err, rows) => {
        res.json(rows || []);
    });
});

// CONFIGURAÇÃO DA PORTA E IP
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando em: http://192.168.100.85:${PORT}`);
    console.log(`📱 Para testar no celular ou navegador, use o IP: 192.168.100.85`);
});