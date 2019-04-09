const express = require("express")
const http = require("http")
const WebSocket = require("ws")

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })
const { subscribe } = require("./sub")

async function main() {
  wss.on("connection", socket => {
    console.log("new connection")
    socket.alive = true

    socket.on("pong", () => {
      socket.alive = true
    })

    socket.send("Hi there, I am a WebSocket server")

    subscribe(message => socket.send(message))
  })

  // ping each client
  setInterval(() => {
    wss.clients.forEach(socket => {
      if (!socket.alive) {
        console.log("closing connection")
        return socket.terminate()
      }

      socket.alive = false
      socket.ping(null, false, true)
    })
  }, 1000)

  server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`)
  })
}

main()
