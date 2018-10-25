"use strict"

const express = require('express')
const bodyParser = require('body-parser')
const grpc = require('grpc')
const { RNode } = require("rchain-api")

var host = "0.0.0.0"
var port = 40401
// var ePort = 8081

// var rchain = RNode(grpc, { host, port })
// var app = express()
// app.use(bodyParser.json())
// app.use(express.static(__dirname))

// app.listen(ePort, () => {
//   console.log(`Connected to RNode at ${host}:${port}`)
//   console.log(`at port ${ePort}`)
// })

// app.post('/startDeployIntervals', (req, res) => {
//   var durPerTest = req.body.durPerTest
//   var dur = req.body.dur
//   var nonce = req.body.nonce
//   var startNonce = nonce

//   var startTime = new Date().valueOf()
//   console.log("--------------------------------------")
//   console.log("Start test " + startTime)

//   var stop = setInterval(() => {
//     doDeploy(nonce)
//     nonce++
//   }, durPerTest)

//   setTimeout(() => {
//     clearInterval(stop);

//     var lastNonce = nonce - 1
//     var totalDeploy = lastNonce - startNonce + 1
//     var endTime = new Date().valueOf()
//     var totalTime = (endTime - startTime) / 1000
//     var tps = totalDeploy / totalTime

//     // res.end(JSON.stringify({ 
//     //   lastNonce: lastNonce,
//     //   totalDeploy: totalDeploy,
//     //   totalTime: totalTime,
//     //   tps: tps
//     // }))
    
//     console.log("End test " + endTime)
//     console.log("Last nonce: " + lastNonce)
//     console.log("Total deploy: " + totalDeploy)
//     console.log("Total time: " + totalTime + "s")
//     console.log("TPS: " + tps)
//     res.end(JSON.stringify({ message: "End test!" }))
    
//   }, dur)
// })

function doDeploy(nonce) {

  const rchain = RNode(grpc, { host, port })

  const term = `
    for(_ <- @"testingContract") {Nil} |
    @"testingContract"!(Nil)
    `

  const deployData = {
    term,
    timestamp: new Date().valueOf(),
    from: '0x1',
    nonce: nonce,
    phloPrice: { value: 0 },
    phloLimit: { value: 1000000 },
  }

  const autoCreateBlock = true
  rchain.doDeploy(deployData, autoCreateBlock)
    .then((deployMessage) => {
      // console.log('doDeploy result:', deployMessage, nonce);
      // return rchain.createBlock();
    })
    .catch((oops) => { console.log(oops); });
}


if (require.main === module) {
    var durPerTest = process.argv[2]
    var dur = process.argv[3]
    var nonce = process.argv[4]
    var startNonce = nonce

    var startTime = new Date().valueOf()
    console.log("Start test " + startTime)

    var stop = setInterval(() => {
        doDeploy(nonce)
        nonce++
    }, durPerTest)

    setTimeout(() => {
        clearInterval(stop);

        var lastNonce = nonce - 1
        var totalDeploy = lastNonce - startNonce + 1
        var endTime = new Date().valueOf()
        var totalTime = (endTime - startTime) / 1000 
        var tps = totalDeploy / totalTime

        console.log("End test " + endTime)
        console.log("Last nonce: " + lastNonce)
        console.log("Total deploy: " + totalDeploy)
        console.log("Total time: " + totalTime + "s")
        console.log("TPS: " + tps) 
    }, dur)

}
