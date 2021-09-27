function generateTxns() {
  fetch("/generate")
}

fetch("/auth")
  .then((response) => response.json())
  .then((data) => {
    const ably = new Ably.Realtime({ key: data.apiKey })
    const channel = ably.channels.get("txn_results")
    channel.subscribe((msg) => {
      const txn = JSON.parse(msg.data)
      document.getElementById(
        "txns"
      ).innerHTML += `<li><strong>Order:</strong> ${txn.order_id} <strong>$ Amount:</strong> ${txn.amount} <strong>Status:</strong> ${txn.status}</li>`
    })
  })
  .catch(function (error) {
    console.log("Error: " + error)
  })
