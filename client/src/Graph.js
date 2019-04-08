import React, { useState } from "react"
import PropTypes from "prop-types"
import { Graphs, canvas } from "react-canvas-time-series"
import moment from "moment"

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

const BACKGROUND_COLOR = "#282c34"
const PADDING = 30
const X_AXIS_HEIGHT = 20
const Y_AXIS_WIDTH = 70
const VOLUME_GRAPH_HEIGHT = 100
// padding between candlestick and volume graph
const GRAPH_PADDING = 20

const X_LABEL_WIDTH = 80
const Y_LABEL_HEIGHT = 20

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

function renderXLabel(x) {
  return moment(x * 1000).format("MM-DD HH:mm")
}

function shouldDrawYLabel(mouse, candlestickGraph, volumeGraph) {
  if (!mouse.y) {
    return false
  }

  if (
    mouse.y >= candlestickGraph.top &&
    mouse.y <= candlestickGraph.top + candlestickGraph.height
  ) {
    return true
  }

  if (
    mouse.y >= volumeGraph.top &&
    mouse.y <= volumeGraph.top + volumeGraph.width
  ) {
    return true
  }

  return false
}

function renderYLabelAtMouse(
  mouse,
  candlestickGraph,
  candlestickYMin,
  candlestickYMax,
  volumeGraph,
  volumeYMin,
  volumeYMax
) {
  if (mouse.y <= candlestickGraph.top + candlestickGraph.height) {
    return renderCandlestickYTick(
      canvas.math.getY(
        candlestickGraph.height,
        candlestickGraph.top,
        candlestickYMax,
        candlestickYMin,
        mouse.y
      )
    )
  } else if (
    mouse.y >= volumeGraph.top &&
    mouse.y <= volumeGraph.top + volumeGraph.height
  ) {
    return renderCandlestickYTick(
      canvas.math.getY(
        volumeGraph.height,
        volumeGraph.top,
        volumeYMax,
        volumeYMin,
        mouse.y
      )
    )
  }
}

function renderCandlestickYTick(y) {
  return y.toFixed(2).toLocaleString()
}

function renderCandlestickYLabel(y) {
  return y.toFixed(2).toLocaleString()
}

function renderVolumeYTick(y) {
  return y.toLocaleString()
}

function renderVolumeYLabel(y) {
  return y.toLocaleString()
}

function renderFrameTimestamp(timestamp) {
  if (timestamp) {
    return moment(timestamp * 1000).format("YYYY - MM - DD HH:mm:ss")
  }
  return ""
}

function renderFramePrice(price) {
  if (price !== undefined) {
    return price.toFixed(2).toLocaleString()
  }
  return ""
}

function Graph(props) {
  const [state, setState] = useState({
    mouse: {
      x: undefined,
      y: undefined,
    },
    nearest: {
      timetamp: undefined,
      open: undefined,
      close: undefined,
      high: undefined,
      low: undefined,
    },
  })

  const { width, height } = props

  const xAxis = getXAxis(props)
  const volumeYAxis = getVolumeYAxis(props)
  const volumeGraph = getVolumeGraph(props)
  const candlestickYAxis = getCandlestickYAxis(props)
  const candlestickGraph = getCandlestickGraph(props)
  const graph = getGraph(props)

  const xMin = 0
  const xMax = 100
  const xTickInterval = 10

  const candlestickYMin = 100
  const candlestickYMax = 1100
  const candlestickYTickInterval = 200

  const volumeYMax = 100
  const volumeYMin = 0
  const volumeYTickInterval = 50

  const data = getRandomCandlestickData(
    1,
    xMin,
    xMax,
    candlestickYMin,
    candlestickYMax,
    volumeYMax
  )
  const timestamps = data.map(d => d.timestamp)
  const latest = data[data.length - 1]

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
      const x = canvas.math.getX(xAxis.width, xAxis.left, xMax, xMin, mouse.x)
      const i = canvas.math.findNearestIndex(timestamps, x)

      let nearest = {
        timetamp: undefined,
        open: undefined,
        close: undefined,
        high: undefined,
        low: undefined,
      }

      if (data[i]) {
        nearest.timestamp = data[i].timestamp
        nearest.open = data[i].open
        nearest.close = data[i].close
        nearest.high = data[i].high
        nearest.low = data[i].low
      }

      setState({
        ...state,
        mouse: {
          x: mouse.x,
          y: mouse.y,
        },
        nearest,
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
      nearest: {
        timetamp: undefined,
        open: undefined,
        close: undefined,
        high: undefined,
        low: undefined,
      },
    })
  }

  const { mouse, nearest } = state

  return (
    <Graphs
      width={width}
      height={height}
      backgroundColor={BACKGROUND_COLOR}
      axes={[
        {
          at: "right",
          ...candlestickYAxis,
          lineColor: "grey",
          yMin: candlestickYMin,
          yMax: candlestickYMax,
          textColor: "lightgrey",
          tickInterval: candlestickYTickInterval,
          renderTick: renderCandlestickYTick,
        },
        {
          at: "right",
          ...volumeYAxis,
          lineColor: "grey",
          yMin: volumeYMin,
          yMax: volumeYMax,
          textColor: "lightgrey",
          tickInterval: volumeYTickInterval,
          renderTick: renderVolumeYTick,
        },
        {
          at: "bottom",
          ...xAxis,
          lineColor: "grey",
          xMin,
          xMax,
          tickInterval: xTickInterval,
          textColor: "lightgrey",
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
          lineColor: "grey",
        },
        {
          type: "yLines",
          ...candlestickGraph,
          yMin: candlestickYMin,
          yMax: candlestickYMax,
          yInterval: candlestickYTickInterval,
          lineColor: "grey",
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
          yMin: volumeYMin,
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
      xLabels={[
        {
          drawLabel: !!mouse.x,
          top: xAxis.top + 10,
          left: mouse.x - X_LABEL_WIDTH / 2,
          width: X_LABEL_WIDTH,
          renderText: () =>
            renderXLabel(
              canvas.math.getX(graph.width, graph.left, xMax, xMin, mouse.x)
            ),
          color: "white",
          backgroundColor: "black",
          lineColor: "white",
          drawLine: !!mouse.x,
          lineTop: graph.top,
          lineBottom: xAxis.top + 10,
        },
      ]}
      yLabels={[
        {
          drawLabel: true,
          top:
            canvas.math.getCanvasY(
              candlestickGraph.height,
              candlestickGraph.top,
              candlestickYMax,
              candlestickYMin,
              latest.close
            ) -
            Y_LABEL_HEIGHT / 2,
          left: graph.left + graph.width + 10,
          height: Y_LABEL_HEIGHT,
          width: Y_AXIS_WIDTH,
          renderText: () => renderCandlestickYLabel(latest.close),
          color: "white",
          backgroundColor: latest.close >= latest.open ? "green" : "red",
          lineColor: latest.close >= latest.open ? "lightgreen" : "pink",
          drawLine: true,
          lineLeft: graph.left,
          lineRight: graph.left + graph.width + 10,
        },
        {
          drawLabel: true,
          top:
            canvas.math.getCanvasY(
              volumeGraph.height,
              volumeGraph.top,
              volumeYMax,
              volumeYMin,
              latest.volume
            ) -
            Y_LABEL_HEIGHT / 2,
          left: graph.left + graph.width + 10,
          height: Y_LABEL_HEIGHT,
          width: Y_AXIS_WIDTH,
          renderText: () => renderVolumeYLabel(latest.volume),
          color: "white",
          backgroundColor: latest.close >= latest.open ? "green" : "red",
          lineColor: latest.close >= latest.open ? "lightgreen" : "pink",
          drawLine: true,
          lineLeft: graph.left,
          lineRight: graph.left + graph.width + 10,
        },
        {
          drawLabel: shouldDrawYLabel(mouse, candlestickGraph, volumeGraph),
          top: mouse.y - Y_LABEL_HEIGHT / 2,
          left: graph.left + graph.width + 10,
          height: Y_LABEL_HEIGHT,
          width: Y_AXIS_WIDTH,
          renderText: () =>
            renderYLabelAtMouse(
              mouse,
              candlestickGraph,
              candlestickYMin,
              candlestickYMax,
              volumeGraph,
              volumeYMin,
              volumeYMax
            ),
          color: "white",
          backgroundColor: "black",
          lineColor: "white",
          drawLine: shouldDrawYLabel(mouse, candlestickGraph, volumeGraph),
          lineLeft: graph.left,
          lineRight: graph.left + graph.width + 10,
        },
      ]}
      frames={[
        {
          text: renderFrameTimestamp(nearest.timestamp),
          color: "white",
          top: candlestickGraph.top + 10,
          left: candlestickGraph.left + 10,
        },
        {
          text: "O",
          color: "grey",
          top: candlestickGraph.top + 30,
          left: candlestickGraph.left + 10,
        },
        {
          text: renderFramePrice(nearest.open),
          color: "white",
          top: candlestickGraph.top + 30,
          left: candlestickGraph.left + 30,
        },
        {
          text: "H",
          color: "grey",
          top: candlestickGraph.top + 30,
          left: candlestickGraph.left + 100,
        },
        {
          text: "123.2345",
          text: renderFramePrice(nearest.high),
          color: "white",
          top: candlestickGraph.top + 30,
          left: candlestickGraph.left + 120,
        },
        {
          text: "L",
          color: "grey",
          top: candlestickGraph.top + 30,
          left: candlestickGraph.left + 200,
        },
        {
          text: "123.2345",
          text: renderFramePrice(nearest.low),
          color: "white",
          top: candlestickGraph.top + 30,
          left: candlestickGraph.left + 220,
        },
        {
          text: "C",
          color: "grey",
          top: candlestickGraph.top + 30,
          left: candlestickGraph.left + 300,
        },
        {
          text: renderFramePrice(nearest.close),
          color: "white",
          top: candlestickGraph.top + 30,
          left: candlestickGraph.left + 320,
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
