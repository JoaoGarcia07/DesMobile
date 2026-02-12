const axios = require('axios');

axios.post('http://localhost:3000/register', {
    nome: "Joao Garcia",
    email: "joao@teste.com",
    senha: "123"
})
.then(res => {
    console.log("✅ USUÁRIO CRIADO COM SUCESSO!");
    console.log("E-mail: joao@teste.com");
    console.log("Senha: 123");
})
.catch(err => {
    console.log("❌ ERRO AO CRIAR USUÁRIO:", err.response ? err.response.data : err.message);
});