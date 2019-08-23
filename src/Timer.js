import React from 'react';
import {FaTrashAlt, FaClock} from 'react-icons/fa';
import {padNumber} from './helpers.js';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {starts: [], stops: [], isRunning: false, laps: [], interval: null};
  }

  incrementTick = () => {
    this.setState((prevState, {timer}) => ({
      elapsed: new Date() - prevState.start,
    }));
  }

  startTimer = () => {
    this.setState((prevState) => ({
      starts: [...this.state.starts, new Date()],
      interval: setInterval(this.incrementTick, 1),
      isRunning: true,
    }));
  }

  stopTimer = () => {
    clearInterval(this.state.interval);
    this.setState((prevState) => ({
      interval: null,
      isRunning: false,
      stops: [...this.state.stops, new Date ()]
    }));
  }

  lap = () => {
    this.setState((prevState, {lap}) => ({
      laps: [...this.state.laps, this.formatTime(this.getCurrentTime())]
    }))
  }

  reset = () => {
    this.stopTimer();
    this.setState(() => ({
      laps: [],
      starts: [],
      stops: [],
    }));
  }

  filterLapArray = (lapArray, itemToRemove) => {
    return lapArray.filter((item, i) => item !== itemToRemove);
  }

  deleteLap = (e) => {
    this.newLapArray = this.filterLapArray(this.state.laps, e.target.closest(".lap").attributes.laptime.value);
    this.setState((prevState) => ({
      laps: this.newLapArray
    }));
  }

  StartButton = () => {
    if (!this.state.isRunning) {
      let startText = 'Start';
      if (this.state.starts.length) {
        startText = 'Resume';
      }
      return (<button onClick={this.startTimer} className="StartButton">{startText}</button>)
    } else {
      return '';
    }
  }

  StopButton = () => {
    if (this.state.isRunning) {
      return (<button onClick={this.stopTimer} className="StopButton">Stop</button>)
    } else {
      return '';
    }
  }

  LapButton = () => {
    if (this.state.isRunning) {
      return (<button onClick={this.lap} className="LapButton">Lap</button>)
    } else {
      return '';
    }
  }

  ResetButton = () => {
    if (this.state.starts.length) {
      return (<button onClick={this.reset} className="ResetButton">Reset</button>)
    } else {
      return '';
    }
  }

  getCurrentTime = () => {
    let elapsed = 0;
    for (let i = 0; i < this.state.stops.length; i++) {
      elapsed += this.state.stops[i] - this.state.starts[i];
    }
    if (this.state.isRunning) {
      elapsed += new Date () - this.state.starts[this.state.starts.length - 1];
    }
    return elapsed;
  }

  formatTime = (time) => {
    let remainingTime = time/1000;
    const hr = Math.floor(remainingTime / 3600);
    remainingTime = remainingTime - hr * 3600;

    const min = Math.floor(remainingTime / 60);
    remainingTime = remainingTime - min * 60;

    const sec = remainingTime;
    return padNumber(hr, 2) + ":" + padNumber(min, 2) + ":" + padNumber(sec.toFixed(3), 2);
  }

  Laps = () =>
    this.state.laps.map(
      (lapTime, i) =>
      <div className="lap" laptime={lapTime} key={'lap' + (i+1).toString()}>
        Lap {i+1}: {lapTime} <FaTrashAlt onClick={this.deleteLap} id={'lap' + (i+1).toString()} laptime={lapTime} />
      </div>
    );

  render = () => {
    return (
      <div>
        {this.formatTime(this.getCurrentTime())} <FaClock /><br /><br />
        <this.StartButton /> <this.StopButton /> <this.LapButton /> <this.ResetButton /><br /><br />
        <div className="LapLog">
          <this.Laps />
        </div>
      </div>
    )
  }
}

export default Timer;