const https = require("https")

const ablyApiKey = "YOUR_API_KEY"

exports.handler = async (event, context) => {
  //console.log('Received event:', JSON.stringify(event, null, 2));
  for (const { messageId, body } of event.Records) {
    const data = JSON.parse(body)
    const output = {
      amount: data.amount,
      order_id: data.order_id,
      txn_id: messageId,
      status: isAuthorized() ? "authorized" : "declined",
    }
    await postMessage("txn_results", JSON.stringify(output))
    console.log(output)
  }
  console.log(`Successfully processed ${event.Records.length} messages.`)
}

function isAuthorized() {
  let rand = Math.floor(Math.random() * 5 + 1)
  return rand < 4
}

async function postMessage(channel, message) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      name: "txn",
      data: message,
    })

    const options = {
      host: "rest.ably.io",
      port: 443,
      path: `/channels/${channel}/messages`,
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(ablyApiKey).toString("base64")}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    }

    let req = https.request(options)
    req.write(data)
    req.end(null, null, () => {
      /* Request has been fully sent */
      resolve(req)
    })
  })
}
