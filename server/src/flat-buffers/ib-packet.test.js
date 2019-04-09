const { buildPacket } = require("./gen-rand-packet")
const { toJSON } = require("./ib-packet")

test("packet", () => {
  const args = {
    time: Math.round(Date.now() / 1000),
    payload: {
      symb: "HUA",
      datetime: "09:34:03-04",
      open: 100,
      high: 200,
      low: 50,
      close: 150,
      volume: 1000,
      wap: 100,
      count: 10,
    },
  }

  const buf = buildPacket(args)
  const json = toJSON(buf)

  expect(json).toEqual({
    type: 5,
    time: expect.any(Number),
    payloadType: 6,
    symb: "HUA",
    datetime: "09:34:03-04",
    open: 100,
    high: 200,
    low: 50,
    close: 150,
    volume: 1000,
    wap: 100,
    count: 10,
  })
})
