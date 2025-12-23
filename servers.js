const express = require('express');
const path = require('path');
const app = express();

// Indica que todos los archivos visuales están en la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Cuando alguien entre a la URL principal, envía el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Configuración del puerto para Render
const PORT = process.env.PORT || 10000; 
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});