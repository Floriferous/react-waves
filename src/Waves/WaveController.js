import React, { Component, PureComponent } from "react";
import PropTypes from "prop-types";

import Wave from "./Wave";

// Inspired by this:
// https://codepen.io/anon/pen/PQxYRy

const FRAMERATE = 60;
const IS_PLAYING = true;
const WAVE_SLOPE = 0.25;

export default class WaveController extends Component {
  constructor(props) {
    super(props);

    this.state = { offset: this.props.initialOffset, diff: 0, diffCount: 0 };

    this.offsetIncrement = this.props.speed / FRAMERATE;
    this.squareRoots = {};
  }

  componentDidMount = () => {
    requestAnimationFrame(this.animate);
  };

  animate = () => {
    if (IS_PLAYING) {
      this.setState(
        ({ offset }) => ({ offset: offset + this.offsetIncrement }),
        () => {
          const t0 = performance.now();
          this.createGraph(this.path);
          const t1 = performance.now();
          const diff = t1 - t0;
          this.setState(({ diff: currentAverage, diffCount }) => ({
            diff: diff + currentAverage,
            diffCount: diffCount + 1
          }));
          requestAnimationFrame(this.animate);
        }
      );
    }
  };

  setPathRef = node => {
    this.path = node;
  };

  createGraph = wave => {
    const { width } = this.props;

    const data = [{ type: "M", values: [0, 0] }];

    for (let x = 0; x < width; x++) {
      data.push({
        type: "L",
        values: [x, 1000 - this.pathFunction(this.state.offset, x)]
      });
    }
    data.push({ type: "L", values: [width, 0] });
    data.push({ type: "Z" });
    wave.setPathData(data);
  };

  pathFunction = (offset, x) => {
    const { frequency, amplitude } = this.props;
    if (!this.squareRoots[x]) {
      // Cache square roots calculation as it's always the same
      this.squareRoots[x] = Math.sqrt(x * frequency);
    }
    return (
      (Math.sin(this.squareRoots[x] - offset) * amplitude + WAVE_SLOPE) * x
    );
  };

  render() {
    const { diff, diffCount } = this.state;
    return (
      <div>
        Wave frame calculation time [ms]:{" "}
        {diff && (diff / diffCount).toFixed(2)}
        <Wave setPathRef={this.setPathRef} {...this.props} />
      </div>
    );
  }
}

WaveController.propTypes = {
  offset: PropTypes.number.isRequired,
  frequency: PropTypes.number.isRequired,
  amplitude: PropTypes.number.isRequired,
  speed: PropTypes.number.isRequired
};
