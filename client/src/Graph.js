import React, { useState } from "react"
import PropTypes from "prop-types"
import { Graphs, canvas } from "react-canvas-time-series"

function rand(min, max) {
  return Math.random() * (max - min) + min
}

function getRandomCandlestickData(xStep, xMin, xMax, yMin, yMax, volumeYMax) {
  let data = []

  const length = Math.round((xMax - xMin) / xStep)

  let high = rand(yMin, yMax)
  let low = rand(yMin, high)

  for (let i = 0; i < length; i++) {
    if (Math.random() > 0.5) {
      high += rand(0, (yMax - yMin) * 0.1)
      low += rand(0, (yMax - yMin) * 0.1)

      high = Math.min(high, yMax)
      low = Math.min(low, yMax)
    } else {
      high -= rand(0, (yMax - yMin) * 0.1)
      low -= rand(0, (yMax - yMin) * 0.1)

      high = Math.max(high, yMin)
      low = Math.max(low, yMin)
    }

    const open = rand(low, high)
    const close = rand(low, high)

    data.push({
      high,
      low,
      open,
      close,
      volume: rand(0, volumeYMax),
      timestamp: xMin + xStep * i,
    })
  }

  return data
}

const PADDING = 30
const X_AXIS_HEIGHT = 20
const Y_AXIS_WIDTH = 70
const VOLUME_GRAPH_HEIGHT = 100
// padding between candlestick and volume graph
const GRAPH_PADDING = 20

// size
function getXAxis({ width, height }) {
  return {
    top: height - PADDING - X_AXIS_HEIGHT,
    left: PADDING,
    height: X_AXIS_HEIGHT,
    width: width - 2 * PADDING - Y_AXIS_WIDTH,
  }
}

function getCandlestickYAxis({ width, height }) {
  return {
    top: PADDING,
    left: width - PADDING - Y_AXIS_WIDTH,
    height:
      height -
      2 * PADDING -
      GRAPH_PADDING -
      X_AXIS_HEIGHT -
      VOLUME_GRAPH_HEIGHT,
    width: Y_AXIS_WIDTH,
  }
}

function getCandlestickGraph({ width, height }) {
  return {
    top: PADDING,
    left: PADDING,
    height:
      height -
      2 * PADDING -
      GRAPH_PADDING -
      X_AXIS_HEIGHT -
      VOLUME_GRAPH_HEIGHT,
    width: width - 2 * PADDING - Y_AXIS_WIDTH,
  }
}

function getVolumeYAxis({ width, height }) {
  return {
    top: height - PADDING - X_AXIS_HEIGHT - VOLUME_GRAPH_HEIGHT,
    left: width - PADDING - Y_AXIS_WIDTH,
    height: VOLUME_GRAPH_HEIGHT,
    width: Y_AXIS_WIDTH,
  }
}

function getVolumeGraph({ width, height }) {
  return {
    top: height - PADDING - X_AXIS_HEIGHT - VOLUME_GRAPH_HEIGHT,
    left: PADDING,
    height: VOLUME_GRAPH_HEIGHT,
    width: width - 2 * PADDING - Y_AXIS_WIDTH,
  }
}

function getGraph({ width, height }) {
  return {
    top: PADDING,
    left: PADDING,
    height: height - 2 * PADDING - X_AXIS_HEIGHT,
    width: width - 2 * PADDING - Y_AXIS_WIDTH,
  }
}

// render
function renderXTick(x) {
  return x
}

function renderCandlestickYTick(y) {
  return y.toFixed(2).toLocaleString()
}

function renderVolumeYTick(y) {
  return y.toLocaleString()
}

function Graph(props) {
  const [state, setState] = useState({
    mouse: {
      x: undefined,
      y: undefined,
    },
  })

  const { width, height } = props

  const xAxis = getXAxis(props)
  const volumeYAxis = getVolumeYAxis(props)
  const volumeGraph = getVolumeGraph(props)
  const candlestickYAxis = getCandlestickYAxis(props)
  const candlestickGraph = getCandlestickGraph(props)
  const graph = getGraph(props)

  function onMouseMove(e, mouse) {
    if (!canvas.math.isInsideRect(graph, mouse)) {
      setState({
        ...state,
        mouse: {
          x: undefined,
          y: undefined,
        },
      })
    } else {
      setState({
        ...state,
        mouse: {
          x: mouse.x,
          y: mouse.y,
        },
      })
    }
  }

  function onMouseOut() {
    setState({
      ...state,
      mouse: {
        x: undefined,
        y: undefined,
      },
    })
  }

  const xMin = 0
  const xMax = 100
  const xTickInterval = 10

  const candlestickYMin = 100
  const candlestickYMax = 1100
  const candlestickYTickInterval = 200

  const volumeYMax = 100
  const volumeYTickInterval = 50

  const data = getRandomCandlestickData(
    1,
    xMin,
    xMax,
    candlestickYMin,
    candlestickYMax,
    volumeYMax
  )

  return (
    <Graphs
      width={width}
      height={height}
      backgroundColor="#282c34"
      axes={[
        {
          at: "right",
          ...candlestickYAxis,
          lineColor: "white",
          yMin: candlestickYMin,
          yMax: candlestickYMax,
          textColor: "white",
          tickInterval: candlestickYTickInterval,
          renderTick: renderCandlestickYTick,
        },
        {
          at: "right",
          ...volumeYAxis,
          lineColor: "white",
          yMin: 0,
          yMax: volumeYMax,
          textColor: "white",
          tickInterval: volumeYTickInterval,
          renderTick: renderVolumeYTick,
        },
        {
          at: "bottom",
          ...xAxis,
          lineColor: "white",
          xMin,
          xMax,
          tickInterval: xTickInterval,
          textColor: "white",
          renderTick: renderXTick,
        },
      ]}
      graphs={[
        {
          type: "xLines",
          ...candlestickGraph,
          xMin,
          xMax,
          xInterval: xTickInterval,
          lineColor: "lightgrey",
        },
        {
          type: "yLines",
          ...candlestickGraph,
          yMin: candlestickYMin,
          yMax: candlestickYMax,
          yInterval: candlestickYTickInterval,
          lineColor: "lightgrey",
        },
        {
          type: "candlestick",
          ...candlestickGraph,
          xMin,
          xMax,
          yMin: candlestickYMin,
          yMax: candlestickYMax,
          candlestickWidth: 5,
          lineWidth: 1,
          getColor: data => (data.close > data.open ? "red" : "green"),
          data,
        },
        {
          type: "bars",
          ...volumeGraph,
          xMin,
          xMax,
          yMin: 0,
          yMax: volumeYMax,
          barWidth: 10,
          getBarColor: d => (d.close > d.open ? "green" : "red"),
          data: data.map(d => ({
            x: d.timestamp,
            y: d.volume,
            open: d.open,
            close: d.close,
          })),
        },
      ]}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseOut}
    />
  )
}

Graph.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
}

export default Graph
