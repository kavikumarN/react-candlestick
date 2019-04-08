import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"

function WindowSize(props) {
  const [state, setState] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  })

  const setWindowSize = () => {
    setState({
      height: window.innerHeight,
      width: window.innerWidth,
    })
  }

  useEffect(
    () => {
      window.addEventListener("resize", setWindowSize)

      return () => {
        window.removeEventListener("resize", setWindowSize)
      }
    },
    [setWindowSize]
  )

  return props.children(state)
}

WindowSize.propTypes = {
  children: PropTypes.func.isRequired,
}

WindowSize.defaultProps = {}

export default WindowSize
