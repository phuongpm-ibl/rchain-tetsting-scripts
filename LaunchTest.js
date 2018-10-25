"use strict"

var request = require('request')

const IP_SERVER_2 = 'http://139.162.33.151'
const IP_SERVER_3 = 'http://139.162.36.232'
const IP_SERVER_4 = 'http://172.104.175.122'

const PORT8080 = ':8080'
const PORT8081 = ':8081'

const START_PROPOSE = '/startPropose'
const STOP_PROPOSE = '/stopPropose'
const START_DEPLOY_INTERVALS = '/startDeployIntervals'

const JSON_HEADERS = {
  'Accept': 'application/json',
  'Content-type': 'application/json',
}

function blockProposalScheduling(durPerTest, dur, nonce) {
  request.post({
    url: IP_SERVER_2 + PORT8080 + START_PROPOSE
  }, (err, res, body) => {
    console.log(JSON.parse(res.body).message)
  })

  request.post({
    url: IP_SERVER_3 + PORT8080 + START_PROPOSE
  }, (err, res, body) => {
    console.log(JSON.parse(res.body).message)
  })

  request.post({
    url: IP_SERVER_4 + PORT8080 + START_PROPOSE
  }, (err, res, body) => {
    console.log(JSON.parse(res.body).message)
  })

  startDeployIntervals(durPerTest, dur, nonce)
}

function stopBlockProposal() {
  request.post({
    url: IP_SERVER_2 + PORT8080 + STOP_PROPOSE
  }, (err, res, body) => {
    console.log(JSON.parse(res.body).message)
  })
  request.post({
    url: IP_SERVER_3 + PORT8080 + STOP_PROPOSE
  }, (err, res, body) => {
    console.log(JSON.parse(res.body).message)
  })
  request.post({
    url: IP_SERVER_4 + PORT8080 + STOP_PROPOSE
  }, (err, res, body) => {
    console.log(JSON.parse(res.body).message)
  })
}

function startDeployIntervals(durPerTest, dur, nonce) {

  let reqBody = {
    durPerTest: durPerTest,
    dur: dur,
    nonce: nonce
  }

  request.post({
    url: IP_SERVER_2 + PORT8081 + START_DEPLOY_INTERVALS,
    headers: JSON_HEADERS,
    body: JSON.stringify(reqBody)
  }, (err, res, body) => {
    console.log(JSON.parse(res.body).message)
  })

  request.post({
    url: IP_SERVER_3 + PORT8081 + START_DEPLOY_INTERVALS,
    headers: JSON_HEADERS,
    body: JSON.stringify(reqBody)
  }, (err, res, body) => {
    console.log(JSON.parse(res.body).message)
  })

  request.post({
    url: IP_SERVER_4 + PORT8081 + START_DEPLOY_INTERVALS,
    headers: JSON_HEADERS,
    body: JSON.stringify(reqBody)
  }, (err, res, body) => {
    console.log(JSON.parse(res.body).message)
  })
}

// function makePost(route, body) {
//   let request = {
//     host: '139.162.33.151',
//     port: '40401',
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Content-type': 'application/json',
//     },
//     body: JSON.stringify(body)
//   }

//   return fetch(route, request)
//     .then(res => { return res.json() })
// }

if (require.main === module) {
  var blockProposalControl = process.argv[2]
  var durPerTest = process.argv[3]
  var dur = process.argv[4]
  var nonce = process.argv[5]
  
  if (blockProposalControl == "start") 
    // blockProposalScheduling(durPerTest, dur, nonce)
    startDeployIntervals(durPerTest, dur, nonce)
  else stopBlockProposal()
}