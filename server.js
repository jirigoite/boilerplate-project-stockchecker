"use strict";

require('dotenv').config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const apiRoutes = require("./routes/api");
const mongoose = require('mongoose');
const app = express();

// 🧠 Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB conectado correctamente'))
.catch(err => console.error('❌ Error al conectar con MongoDB:', err.message));


// Seguridad con Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false, // evita errores en Replit
  })
);


// Permitir CORS (para que FreeCodeCamp acceda)
app.use(cors({ origin: "*" }));

// Ruta principal
app.get("/", (req, res) => {
  res.send("🚀 Stock Price Checker activo");
});

// Rutas API
apiRoutes(app);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));

module.exports = app;
