'use strict';
const mongoose = require("mongoose");
const fetch = require("node-fetch");

const stockSchema= new mongoose.Schema({
	stock: String,
	likes: [String],
});

const Stock = mongoose.model("Stock", stockSchema);

// Funcion para anonimizar IP (Ultimo segmento en 0)
function anonymizeIP(ip){
	return ip.replace(/\.\d+$/, ".0");
}

// Obtener precio del stock desde el proxy de FCC
async function getStockPrice(symbol){
const res= await fetch(
	`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`
);
const data = await res.json();
return data.latestPrice;
}

module.exports = function (app) {
	app.get("/api/stock-prices", async (req, res) => {
	try {
		const { stock, like } = req.query;
		const ip = anonymizeIP(res.ip);
		const stocks = Array.isArray(stock) ? stock : [stock];
		const results = [];

		for (const s of stocks) {
		 const symbol = s.toUpperCase();
		 const price = await getStockPrice(symbol);

		let stockDoc = await Stock.findOne({ stock: symbol });
		if (!stockDoc){
		 stockDoc = new Stock({ stock: symbol, likes: [] });
		}
		if (like && !stockDoc.likes.includes(ip)) {
		stockDoc.likes.push(ip);
		await stockDoc.save();
		}

	 results.push({
	stock: symbol,
	price,
	likes: stockDoc.likes.length,
	});
}

//Si hay 2 acciones, calcular direcia de likes

if (results.length === 2) {
	const relLikes1 = results[0].likes - results[1].likes;
	const relLikes2 = results[1].likes - results[0].likes;

return res.json({
	stockData: [
	{
	stock: results[0].stock,
	price: results[0].price,
	rel_likes: relLikes1,
	},

	{
	stock: results[1].stock,
        price: results[1].price,
        rel_likes: relLikes2,
	},
],

});
}

// Si hay 1 sola accion
	res.json({ stockData: results[0] });
} catch (err) {
	console.error(err);
	res.status(500).json({ error: "Error interno del servidor"});
}

});
};
