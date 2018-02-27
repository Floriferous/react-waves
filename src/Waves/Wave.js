import React, { Component } from "react";
import PropTypes from "prop-types";

class Wave extends Component {
  render() {
    const { setPathRef, color, gradient, color1, color2 } = this.props;
    return (
      <div
        style={{
          width: "120%",
          height: "1500px",
          margin: "80px 0",
          position: "absolute",
          left: "-10%",
          right: 0,
          top: 0
        }}
      >
        <svg className="svg" width="100%" height="100%">
          <defs>
            <linearGradient
              id="linear"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
              spreadMethod="pad"
            >
              <stop offset="0%" stopColor={color1} />
              <stop offset="100%" stopColor={color2} />
            </linearGradient>
          </defs>
          <path
            fill={gradient ? "url(#linear)" : color}
            d="M0,150"
            ref={setPathRef}
          />
        </svg>
      </div>
    );
  }
}

Wave.propTypes = {
  setPathRef: PropTypes.func.isRequired,
  color: PropTypes.string,
  gradient: PropTypes.bool,
  color1: PropTypes.string,
  color2: PropTypes.string
};

export default Wave;
