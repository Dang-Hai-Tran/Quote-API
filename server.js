const express = require("express");
const app = express();

const { quotes } = require("./data");
const { getRandomElement } = require("./utils");

const PORT = process.env.PORT || 4001;

app.use(express.static("public"));
app.listen(PORT, () => {
  console.log(`Listening port ${PORT}`);
});
app.get("/api/quotes/random", (req, res) => {
  const random_quote = getRandomElement(quotes);
  res.send({quote: random_quote});
});
app.get("/api/quotes", (req, res) => {
  if (!req.query.person) {
    res.send({ quotes: quotes});
  } else {
    const person = req.query.person;
    const quote_of_person = quotes.find((item) => item.person === person);
    if (quote_of_person) {
      res.send({quotes: quote_of_person});
    } else {
      res.status(400).send();
    }
  }
});
