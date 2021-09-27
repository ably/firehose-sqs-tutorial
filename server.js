// server.js

require("dotenv").config()

const express = require("express")
const app = express()
const faker = require("faker")
const Ably = require("ably")
const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY })

const channel = ably.channels.get("orders")

// make all the files in 'public' available
app.use(express.static("public"))

// load the home page, index.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html")
})

app.get("/auth", (request, response) => {
  response.json({ apiKey: process.env.ABLY_API_KEY })
})

app.get("/generate", (request, response) => {
  console.log(process.env.NUM_TXNS)
  for (i = 0; i < process.env.NUM_TXNS; i++) {
    console.log("hi")
    let randtxn = {
      amount: faker.finance.amount(),
      timestamp: faker.date.recent(),
      cardnumber: faker.finance.creditCardNumber(),
      expiry: `${faker.date.future().getUTCMonth() + 1}/${
        faker.date.future().getUTCFullYear() + 1
      }`,
      cvv: faker.finance.creditCardCVV(),
      order_id: faker.finance.account(),
    }
    console.log(JSON.stringify(randtxn))
    channel.publish("created", JSON.stringify(randtxn))
  }
  response.sendStatus(200)
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + process.env.PORT)
})
