import React, { Component } from "react"
import "./App.css"
import WindowSize from "./WindowSize"
import Graph from "./Graph"

class App extends Component {
  render() {
    return (
      <div className="App">
        <WindowSize>{props => <Graph {...props} />}</WindowSize>
      </div>
    )
  }
}

export default App
