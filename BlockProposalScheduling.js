"use strict"

const express = require('express')
const bodyParser = require('body-parser')
const grpc = require('grpc')
const { RNode } = require("rchain-api")

var myInterval

var host = "0.0.0.0"
var port = 40401
var ePort = 8080

var rchain = RNode(grpc, { host, port })
var app = express()

app.use(bodyParser.json())
app.use(express.static(__dirname))

app.listen(ePort, () => {
  console.log(`Connected to RNode at ${host}:${port}`)
  console.log(`at port ${ePort}`)
})

app.post('/startPropose', (req, res) => {
  clearInterval(myInterval)
  myInterval = setInterval(() => {
    rchain.createBlock()
      .then(result => console.log(result))
      .catch(_ => console.log("Error: no new deploys / another propose in progress..." + new Date().toLocaleString()))
  }, 1000)
  res.end(JSON.stringify({ message: "Block proposal scheduling and started! \n Start test!" }))
})

app.post('/stopPropose', (req, res) => {
  clearInterval(myInterval)
  res.end(JSON.stringify({ message: "Block proposal scheduling has been stopped!" }))
})


// if (require.main === module) {
//     setInterval(() => {
//         proposeBlock()
//     }, 1000)
// }
