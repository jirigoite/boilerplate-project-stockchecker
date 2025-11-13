"use strict";

require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const apiRoutes = require("./routes/api");
const app = express();

// =====================================================
// 🛡️ CSP — aplicar SIEMPRE, para TODAS las rutas
// =====================================================

// Remover cualquier CSP previo generado por Replit
app.use((req, res, next) => {
  res.removeHeader("Content-Security-Policy");
  res.removeHeader("X-Content-Security-Policy");
  res.removeHeader("X-Webkit-Csp");
  next();
});

// Setear CSP EXACTO requerido por FreeCodeCamp
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self';"
  );
  next();
});

// Seguridad extra sin interferir
app.use(helmet.hidePoweredBy());
app.use(helmet.noSniff());
app.use(helmet.xssFilter());

// CORS
app.use(cors({ origin: "*" }));

// Página principal
app.get("/", (req, res) => {
  res.send("🚀 Stock Price Checker activo");
});

// Rutas API
apiRoutes(app);

// Catch-all (MUY IMPORTANTE para pasar el test)
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Servidor escuchando en 0.0.0.0:${PORT}`)
);

module.exports = app;
