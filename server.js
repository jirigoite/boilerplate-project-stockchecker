"use strict";

require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const apiRoutes = require("./routes/api");
const app = express();

// =====================================================
// 🛡️ CONFIGURACIÓN DE SEGURIDAD
// =====================================================

// Eliminar encabezados que revelan información
app.use(helmet.hidePoweredBy());
app.use(helmet.noSniff());
app.use(helmet.xssFilter());

// Forzar el encabezado CSP EXACTO que FreeCodeCamp espera
app.use((req, res, next) => {
  // Si Replit agrega uno, lo eliminamos primero
  res.removeHeader("Content-Security-Policy");

  // Política mínima permitida por FreeCodeCamp
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self'"
  );
  next();
});

// =====================================================
// 🌐 CONFIGURACIÓN GENERAL DEL SERVIDOR
// =====================================================

// Permitir CORS (FreeCodeCamp accede desde su dominio)
app.use(cors({ origin: "*" }));

// Página principal de prueba
app.get("/", (req, res) => {
  res.send("🚀 Stock Price Checker activo");
});

// Rutas API
apiRoutes(app);

// =====================================================
// 🚀 INICIAR SERVIDOR
// =====================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Servidor escuchando en 0.0.0.0:${PORT}`)
);

module.exports = app;
