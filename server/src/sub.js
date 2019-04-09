const zmq = require("zeromq")
const sock = zmq.socket("sub")

const TOPIC = ""
sock.connect(process.env.ZMQ_PUB_URL)
sock.subscribe(TOPIC)
console.log(`Subscriber connected to port ${process.env.ZMQ_PUB_URL}`)

sock.on("message", (topic, message) => {
  console.log("topic:", topic.toString(), "message:", message.toString())
})