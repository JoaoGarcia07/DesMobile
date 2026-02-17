import axios from 'axios';

// IP atualizado conforme seu ipconfig
const api = axios.create({
  baseURL: 'http://192.168.100.82:3000', 
  timeout: 5000, // Desiste após 5 segundos se o servidor não responder
});

export default api;