const express = require("express");
const fs = require("fs");
const app = express();

let quotes = [];
fs.readFile("./data.json", "utf-8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    quotes = JSON.parse(data);
  }
});
const { getRandomElement } = require("./utils");

const PORT = process.env.PORT || 4001;

app.use(express.static("public"));
app.listen(PORT, () => {
  console.log(`Listening port ${PORT}`);
});
app.get("/api/quotes/random", (req, res) => {
  const random_quote = getRandomElement(quotes);
  res.send({ quote: random_quote });
});
app.get("/api/quotes", (req, res) => {
  if (!req.query.person) {
    res.send({ quotes: quotes });
  } else {
    const person = req.query.person;
    const quote_of_person = quotes.find((item) => item.person === person);
    if (quote_of_person) {
      res.send({ quotes: quote_of_person });
    } else {
      res.status(400).send();
    }
  }
});
app.post("/api/quotes", (req, res) => {
  const quote = req.query.quote;
  const person = req.query.person;
  if (quote && person) {
    quotes.push({ quote: quote, person: person });
    fs.writeFile("./data.json", JSON.stringify(quotes), (err) => {
      if (err) {
        console.log(err);
      }
    });
    res.send({ quote: quote, person: person });
  } else {
    res.status(400).send();
  }
});
app.put("/api/quotes", (req, res) => {
  const person = req.query.person;
  const new_quote = req.query.quote;
  if (person && new_quote) {
    const found = quotes.find((item) => item.person === person);
    if (found) {
      found.quote = new_quote;
      fs.writeFile("./data.json", JSON.stringify(quotes), (err) => {
        if (err) {
          console.log(err);
        }
      });
      res.send({ person: person, quote: new_quote });
    } else {
      res.status(404).send();
    }
  } else {
    res.status(404).send();
  }
});
app.delete("/api/quotes", (req, res) => {
  const person = req.query.person;
  if (person) {
    const found = quotes.find((item) => item.person === person);
    if (found) {
      quotes = quotes.filter((item) => item.person !== person);
      fs.writeFile("./data.json", JSON.stringify(quotes), (err) => {
        if (err) {
          console.log(err);
        }
      });
      res.status(204).send();
    } else {
      res.status(404).send('Person not found')
    }
  } else {
    res.status(404).send('Parameter empty');
  }
});
