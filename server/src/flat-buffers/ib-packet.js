const flatbuffers = require("flatbuffers").flatbuffers
const IbPacket = require("./packet_generated").IbPacket

function toJSON(uint8Arr) {
  const buf = new flatbuffers.ByteBuffer(uint8Arr)

  const pkt = IbPacket.Packet.getRootAsPacket(buf)
  const tick = new IbPacket.Tick()

  return {
    type: pkt.type(),
    time: pkt.time().hight,
    payloadType: pkt.payloadType(),
    symb: pkt.payload(tick).symb(),
    type: pkt.type(),
    time: pkt.time().high,
    payloadType: pkt.payloadType(),
    symb: pkt.payload(tick).symb(),
    datetime: pkt.payload(tick).datetime(),
    open: pkt.payload(tick).open(),
    high: pkt.payload(tick).high(),
    low: pkt.payload(tick).low(),
    close: pkt.payload(tick).close(),
    volume: pkt.payload(tick).volume().high,
    wap: pkt.payload(tick).wap(),
    count: pkt.payload(tick).count(),
  }
}

module.exports = {
  toJSON,
}
