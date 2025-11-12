const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  this.timeout(5000);

  test("Viewing one stock", function (done) {
    chai.request(server)
      .get("/api/stock-prices")
      .query({ stock: "GOOG" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "stockData");
        assert.property(res.body.stockData, "stock");
        assert.property(res.body.stockData, "price");
        assert.property(res.body.stockData, "likes");
        done();
      });
  });

  test("Viewing one stock and liking it", function (done) {
    chai.request(server)
      .get("/api/stock-prices")
      .query({ stock: "AAPL", like: true })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body.stockData, "likes");
        done();
      });
  });

  test("Viewing same stock and liking it again", function (done) {
    chai.request(server)
      .get("/api/stock-prices")
      .query({ stock: "AAPL", like: true })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body.stockData, "likes");
        done();
      });
  });

  test("Viewing two stocks", function (done) {
    chai.request(server)
      .get("/api/stock-prices")
      .query({ stock: ["GOOG", "MSFT"] })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        done();
      });
  });

  test("Viewing two stocks and liking them", function (done) {
    chai.request(server)
      .get("/api/stock-prices")
      .query({ stock: ["GOOG", "MSFT"], like: true })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        done();
      });
  });
});

