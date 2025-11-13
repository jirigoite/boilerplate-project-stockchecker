"use strict";

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api");
const app = express();

// =====================================================
// 🛡️ CONTENT SECURITY POLICY — EXACTO COMO FREECODECAMP PIDE
// =====================================================

// Middleware CSP (debe estar ARRIBA, antes de todo)
app.use((req, res, next) => {
  // Evitar que Replit/other middlewares agreguen CSP adicionales
  res.removeHeader("Content-Security-Policy");
  res.removeHeader("X-Content-Security-Policy");
  res.removeHeader("X-Webkit-Csp");

  // 💯 ESTE ES EL VALOR EXACTO QUE FREECODECAMP VALIDA
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self';"
  );

  next();
});

// =====================================================
// 🌐 CONFIGURACIÓN GENERAL DEL SERVIDOR
// =====================================================
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("🚀 Stock Price Checker activo");
});

// API Routes
apiRoutes(app);

// =====================================================
// 🚀 INICIAR SERVIDOR
// =====================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Servidor escuchando en 0.0.0.0:${PORT}`)
);

module.exports = app;
