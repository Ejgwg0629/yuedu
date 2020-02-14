/* global chrome */
import React from 'react';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      result: ""
    }
    this.timeout = null;
    this.update = this.update.bind(this);
  }
  update(event) {
    clearTimeout(this.timeout);

    var target = event.target;
    this.timeout = setTimeout((target) => {
      var url = "https://www.weblio.jp/content/" + target.value;
      var app = this;
      chrome.runtime.sendMessage({msg: url}, (response) => {
        app.setState({result: response});
      });
      target.select();
    }, 900, target);
  }
  render() {
    return (
      <div className="container">
        <input onMouseOver={(e) => {e.target.select();}} onChange={this.update}></input>
        <div className="content">{this.state.result}</div>
      </div>
    )
  }
}



export default App;
