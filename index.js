require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const PORT = process.env.PORT || 3003;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/price", async (req, res) => {
  const key = process.env.API_KEY;
  const response = await axios.get(
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
    {
      headers: {
        "X-CMC_PRO_API_KEY": key,
      },
    }
  );
  const result = response.data.data.find((coin) => coin.symbol === "BTC");
  res.send(`${result.name} is currently worth $${result.quote.USD.price} USD`);
});

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`Server listening on PORT ${PORT}`);
});
