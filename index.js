require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cache = require("memory-cache");
const ethers = require("ethers");

const PORT = process.env.PORT || 3003;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/price/:symbol", async (req, res) => {
  const key = process.env.API_KEY;
  const symbol = req.params.symbol;
  const response = await axios.get(
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
    {
      headers: {
        "X-CMC_PRO_API_KEY": key,
      },
    }
  );
  const result = response.data.data.find(
    (coin) => coin.symbol === symbol.toUpperCase()
  );
  res.send(`${result.name} is currently worth $${result.quote.USD.price} USD`);
});

app.get("/balance/:address", async (req, res) => {
  const address = req.params.address;
  const response = await axios.get(
    `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.ETHERSCAN_API_KEY}`
  );

  const balance = ethers.utils.formatEther(response.data.result);

  res.send(`ETH balance for ${address} is ${balance}`);
});

app.get("/balance/:address/:token", async (req, res) => {
  const address = req.params.address;

  // let tokens = await cache.get("tokens");
  // if (!tokens) {
  //     tokens = await axios.get("https://tokens.coingecko.com/uniswap/all.json");
  //     cache.put("tokens", tokens, 1000 * 60 * 60);
  // }

  // const token = tokens.data.tokens.find(token => token.symbol === req.params.token.toUpperCase());
  // const token_balance = await axios.get(`https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${token.address}&address=${address}&tag=latest&apikey=${process.env.ETHERSCAN_API_KEY}`);

  const user_tokens = await axios.get(
    `https://api.etherscan.io/api?module=account&action=addresstokenbalance&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`
  );
  const token = user_tokens.data.result.find(
    (token) => token.TokenSymbol === req.params.token.toUpperCase()
  );

  // const response = await axios.get(
  //   `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.ETHERSCAN_API_KEY}`
  // );

  const balance = ethers.utils.formatEther(token.TokenQuantity);

  res.send(`ETH balance for ${address} is ${balance}`);
});

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`Server listening on PORT ${PORT}`);
});
