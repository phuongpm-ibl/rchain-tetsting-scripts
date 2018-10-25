"use strict"

const grpc = require('grpc')
const { RNode } = require("rchain-api")

var host = "localhost"
var port = 40401

function doDeploy(nonce, loops) {
    const rchain = RNode(grpc, { host, port })

    const term = `
        for(_ <- @"testingContract") {Nil} |
        @"testingContract"!(Nil)
        `

    var startNonce = parseInt(nonce, 10)

    var startTime = new Date().valueOf()
    console.log("Start test " + startTime)

    for (var i = 0; i < loops; i++) {
        const deployData = {
            term,
            timestamp: new Date().valueOf(),
            from: '0x1',
            nonce: i + nonce,
            phloPrice: { value: 0 },
            phloLimit: { value: 1000000 },
        }

        const autoCreateBlock = true
        rchain.doDeploy(deployData, autoCreateBlock)
            .then((deployMessage) => {
                // console.log('doDeploy result:', deployMessage, nonce);
            })
            .catch((oops) => { console.log(oops); });
    }

    var endTime = new Date().valueOf()
    console.log("End test " + endTime)

    var totalTime = (endTime - startTime) / 1000
    var lastNonce = i + startNonce - 1
    var totalDeploy = lastNonce - startNonce + 1
    var tps = totalDeploy / totalTime

    console.log("Last nonce: " + lastNonce)
    console.log("Total deploy: " + totalDeploy)
    console.log("Total time: " + totalTime + "s")
    console.log("TPS: " + tps)
}


if (require.main === module) {
    var nonce = process.argv[2]
    var loops = process.argv[3]
    doDeploy(nonce, loops)
}
