/* global chrome */
import React from 'react';
import Input from './Input';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: props.hidden || true,
      position: props.position || {},
      word: props.word || "",
      language: "English",
      translation: props.translation || {
        translations: []
      }
    }

    document.addEventListener("mouseup", this.onClickedDispatcher);
  }

  onClickedDispatcher = (event) => {
    var selection = window.getSelection();
    var target = event.target;
    if (selection.type === "Range") {
      if (this.shouldUpdatePosition(target, selection)) {
        if (selection.toString() !== this.state.word) {
          this.setState({
            hidden: false,
            word: selection.toString(),
            position: this.getPosition(selection.getRangeAt(0).getBoundingClientRect()),
            translation: {
              translations: []
            }
          })
          this.translateWord(selection.toString());
        } else {
          this.setState({
            hidden: false,
            word: selection.toString(),
            position: this.getPosition(selection.getRangeAt(0).getBoundingClientRect())
          })
        }
      } else {
        if (selection.toString() !== this.state.word) {
          this.setState({
            hidden: false,
            word: selection.toString(),
            translation: {
              translations: []
            }
          })
          this.translateWord(selection.toString());
        } else {
          this.setState({
            hidden: false,
            word: selection.toString(),
          })
        }
      }
    } else {
      if (event.target.closest("#yuedu-flex-container") != null) {
        return;
      } else {
        if (this.state.hidden === false) {
          this.setState({
            hidden: true
          })
        }
      }
    }
  }

  shouldUpdatePosition(target, selection) {
    if (target.closest("#yuedu-flex-container") != null) {
      return false;
    }
    var testElement;
    if (selection.anchorNode.nodeType !== Node.ELEMENT_NODE) {
      // TODO: Node.nodeType
      testElement = selection.anchorNode.parentElement;
    } else {
      testElement = selection.anchorNode;
    }
    if (testElement.closest("#yuedu-flex-container") != null) {
      // mouseUp is triggered but is no business with us
      return false;
    }
    return true;
  }

  getPosition(range) {
    var width = 326;
    var left = window.pageXOffset + range.x;
    if (left + width > window.innerWidth) {
      left = window.innerWidth - width - 10;
    }
    var top = window.pageYOffset + range.y + 20;
    return {top: top, left: left}
  }

  translateWord = (word) => {
    var app = this;
    chrome.runtime.sendMessage({word: word, lanuage: this.state.language}, (response) => {
      console.log(app);
      console.log(this);
      app.setState({translation: response});
    });
  }

  render() {
    console.log("App re-rendered");
    return (
      <div id="yuedu-flex-container" 
        style={this.state.position}
        className={ this.state.hidden ? "yuedu-container-hidden" : "yuedu-container-visible" }>
        
        <Input 
          onInputChange={this.onInputChange}
          onInputTimeout={this.onInputTimeout}
          word={this.state.word} 
        />
        {this.state.translation.pronounces ? (
          <Pronounce pronounces={this.state.translation.pronounces} />
        ) : false }
        
        {this.state.translation.translations ? (
          <Translation translations={this.state.translation.translations} />
        ) : false}

      </div>
    )
  }

  onInputChange = (word) => {
    this.setState({
      word: word
    });
  }

  onInputTimeout = (word) => {
    // keep a last word to compare with ?
    this.translateWord(word);
  }
}


class Pronounce extends React.Component {
  render() {
    console.log("Pronounce re-rendered");

    var pronounces;
    if (this.props.pronounces) {
      pronounces = this.props.pronounces.map((item) => (
        <div>
          <span>{item.language}</span>
          <span>{item.pronounce}</span>
        </div>
      ))
    }
    
    if (pronounces) {
      return (
        <div className="pronounce">{pronounces}</div>
      )
    }
  }
}


class Translation extends React.Component {
  render() {
    console.log("Translation re-rendered");

    var translations;
    if (this.props.translations) {
      translations = this.props.translations.map((item) => (
        <div>
          <span>{item.PoS}</span>
          <span>{item.translation}</span>
        </div>
      ))
    }
    return (<div className="translation">{translations}</div>)
  }
}


export default App;
