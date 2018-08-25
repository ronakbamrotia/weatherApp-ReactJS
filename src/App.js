import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: "",
      lng: "",
      value: "",
      currently: "",
      willbe: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${
          this.state.value
        }`
      )
      .then(res => {
        if (res.data.status === "OK") {
          var lat = res.data.results[0].geometry.location.lat;
          var lng = res.data.results[0].geometry.location.lng;
          this.setState({ lat: lat });
          this.setState({ lng: lng });

          axios
            .get(
              `https://api.darksky.net/forecast/81e7f80310da9bb9943e1645f726c085/${lat},${lng}`
            )
            .then(res1 => {
              if (res1.status === 200) {
                var arr = res1.data.hourly.data;
                console.log(arr);
                var length = Object.keys(arr).length;
                var temps = [];
                for (var i = 1; i < 5; i++) {
                  var obj = [];
                  obj.temp = ((arr[i].temperature - 32) * (5 / 9)).toFixed(2);

                  var date = new Date(arr[i].time * 1000);
                  // Hours part from the timestamp
                  var hours = date.getHours();
                  // Minutes part from the timestamp
                  var minutes = "0" + date.getMinutes();
                  // Seconds part from the timestamp
                  var seconds = "0" + date.getSeconds();
                  console.log(
                    date + "  " + hours + "   " + minutes + "   " + seconds
                  );

                  obj.time = hours + " : " + minutes;
                  temps.push(obj);
                }
                this.setState({ willbe: temps });
                console.log(this.state);
              }
            });
        }
      });
  }

  createDivs() {
    if (this.state.willbe) {
      var qw = [];
      for (var i = 0; i < this.state.willbe.length; i++) {
        qw.push(
          <div key={i} className="temp-div-inner">
            The temperature will be {this.state.willbe[i]["temp"]}
            &deg;C around
            {this.state.willbe[i]["time"]}
          </div>
        );
      }
      return qw;

      // return <div>asda</div>;
      // this.state.willbe.map(el => {
      //   return <div>{el}</div>;
      // });
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
              className="place-input"
            />
          </div>
          <div>
            <input className="place-submit" type="submit" value="Submit" />
          </div>
        </form>
        <div className="temp-divs">{this.createDivs()}</div>
      </div>
    );
  }
}

export default App;
