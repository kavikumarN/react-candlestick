const zmq = require("zeromq")
const sock = zmq.socket("sub")
const flatbuffers = require("flatbuffers").flatbuffers
const { toJSON } = require("./flat-buffers/ib-packet")

const TOPIC = ""

function subscribe(callback) {
  sock.connect(process.env.ZMQ_PUB_URL)
  sock.subscribe(TOPIC)
  console.log(`Subscriber connected to port ${process.env.ZMQ_PUB_URL}`)

  sock.on("message", (topic, message) => {
    // console.log("topic:", topic.toString(), "message:", message.toString())

    // TODO fix cannot parse message to JSON
    const data = new Uint8Array(message)
    console.log(toJSON(data))

    // callback(JSON.stringify(toJSON(message)))
    callback("foo")
  })
}

module.exports = {
  subscribe,
}
