import app from './app';

// Define a porta em que o servidor irá rodar
const port = 3000;

// Inicia o servidor e exibe uma mensagem no console
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});