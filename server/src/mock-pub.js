const zmq = require("zeromq")
const sock = zmq.socket("pub")
const { generateRandomPacket } = require("./flat-buffers/gen-rand-packet")
const { toJSON } = require("./flat-buffers/ib-packet")

sock.bindSync(process.env.ZMQ_PUB_URL)
console.log(`Publisher bound to ${process.env.ZMQ_PUB_URL}`)

const TOPIC = ""

// console.log(toJSON(generateRandomPacket()))

setInterval(() => {
  console.log("sending a message")
  // TODO fix cannot send Uint8Array?
  // https://github.com/zeromq/zeromq.js/issues/268
  sock.send([TOPIC, generateRandomPacket()])
}, 1000)
