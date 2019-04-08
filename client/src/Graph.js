import React from "react"
import PropTypes from "prop-types"
import { Graphs, canvas } from "react-canvas-time-series"

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
  const { width, height } = props

  const xAxis = getXAxis(props)
  const volumeYAxis = getVolumeYAxis(props)
  const candlestickYAxis = getCandlestickYAxis(props)

  const xMin = 0
  const xMax = 100
  const xTickInterval = 10

  const volumeYMax = 100
  const volumeYTickInterval = 50

  const candlestickYMin = 100
  const candlestickYMax = 1100
  const candlestickYTickInterval = 100

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
    />
  )
}

Graph.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
}

export default Graph
