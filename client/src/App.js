import React, { Component, useEffect } from "react"
import "./App.css"
import WindowSize from "./WindowSize"
import Graph from "./Graph"

function App(props) {
  useEffect(() => {
    const wsClient = new WebSocket(process.env.REACT_APP_WEB_SOCKET)

    wsClient.onopen = e => console.log("web socket open", e)
    wsClient.onmessage = e => console.log("web socket message", e)
    wsClient.onerror = e => console.error("web socket error", e)
    wsClient.onclose = e => console.error("web socket close", e)

    return () => wsClient.close()
  })

  return (
    <div className="App">
      <WindowSize>{props => <Graph {...props} />}</WindowSize>
    </div>
  )
}

export default App
