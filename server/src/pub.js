const zmq = require("zeromq")
const sock = zmq.socket("pub")
const { generateRandomPacket } = require("./flat-buffer/gen-rand-packet")

sock.bindSync(process.env.ZMQ_PUB_URL)
console.log(`Publisher bound to ${process.env.ZMQ_PUB_URL}`)

const TOPIC = ""

setInterval(() => {
  console.log("sending a message")
  sock.send([TOPIC, generateRandomPacket()])
}, 500)
