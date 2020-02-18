'use strict';

chrome.runtime.onInstalled.addListener(function () {
  console.log("every time runtime.reload");
});

function getTrans(word, sendResponse) {
  var url = "https://www.weblio.jp/content/" + word;
  var req = new XMLHttpRequest();
  req.open('GET', url);
  req.onload = () => {
    if (req.status == 200) {
      var parser = new DOMParser();

      var doc = parser.parseFromString(req.response, "text/html");
      var response = doc.querySelector(".kijiWrp");
      sendResponse(response.textContent);
    }
  };
  req.onerror = () => {
    sendResponse("Network error");
  };

  req.send();
}

function getTransFromYoudao(word, sendResponse) {
  var url = "https://youdao.com/w/" + word;
  var req = new XMLHttpRequest();
  req.open('GET', url);
  req.onload = () => {
    if (req.status == 200) {
      var parser = new DOMParser();
      try {
        var doc = parser.parseFromString(req.response, "text/html");
        var response = doc.getElementById("phrsListTab");
        Array.from(response.children).forEach(ele => {
          if (ele.localName === "script" || ele.localName === "style") {
            response.removeChild(ele);
          }
        });
        sendResponse(parseYoudao(response));
      } catch (err) {
        sendResponse({
          translations: []
        });
      }
    }
  };
  req.onerror = () => {
    sendResponse("Network error");
  };

  req.send();
}

function parseYoudao(collection) {
  try {
    var pronounces = [];
    collection.querySelectorAll(".pronounce").forEach((ele) => {
      pronounces.push({
        language: ele.firstChild != null ?
          ele.firstChild.textContent.replace(/^\s+|\s+$/g, "") : "",
        pronounce: ele.querySelector(".phonetic") != null ?
          ele.querySelector(".phonetic").textContent.replace(/^\s+|\s+$/g, "") : ""
      })
    });

    var translations = [];
    var lis = collection.querySelector(".trans-container").getElementsByTagName("li");
    Array.from(lis).forEach((ele) => {
      var text = ele.textContent;
      translations.push({
        PoS: text.replace(/^(\w+\.)(.*)$/, "$1"),
        translation: text.replace(/^(\w+\.)(.*)$/, "$2").replace(/^\s+|\s+$/g, "")
      })
    });

    if (translations.length > 0) {
      return {
        pronounces: pronounces,
        translations: translations
      }
    } else {
      return {
        translations: []
      }
    }
  } catch (err) {
    return {
      translations: []
    }
  }
}

class Dict {
  constructor(word, sendResponse) {
    this.word = this.normalize(word);
    this.sendResponse = sendResponse;
  }

  normalize = (word) => {
    word = word.replace(/^\s+|\s+$/, "");
    word = word.replace(/\s+/, " ");
    return word;
  }

  getFromCache = () => {
    return null;
  }

  translateWord = () => {
    var xhr = new XMLHttpRequest();
    var url = this.urlBase + this.word;
    xhr.open('GET', url);
    xhr.onload = () => {
      if (xhr.status == 200) {
        var parser = new DOMParser();
        try {
          var doc = parser.parseFromString(xhr.response, "text/html");
          this.sendResponse(this.parseDoc(doc));
        } catch (err) {
          console.log(err);
          this.sendNotFound();
        }
      }
    };
    xhr.onerror = () => {
      this.sendError();
    };
    xhr.send();
  }

  sendNotFound = () => {
    this.sendResponse({
      pronounces: [],
      translations: [{
        translation: `parse error`
      }]
    });
  }

  sendError = () => {
    this.sendResponse({
      pronounces: [],
      translations: [{
        translation: `network error ..?`
      }]
    });
  }
}

class Youdao extends Dict {
  constructor(word, sendResponse) {
    super(word, sendResponse);
    this.urlBase = "https://youdao.com/w/";

    let result = this.getFromCache();
    if (result != null) {
      this.sendResponse(result);
    } else {
      this.translateWord();
    }
  }

  parseDoc = (doc) => {
    var response = doc.getElementById("phrsListTab");
    // TODO: if no #phrsListTab, fallback to networklist ?
    
    Array.from(response.children).forEach(ele => {
      if (ele.localName === "script" || ele.localName === "style") {
        response.removeChild(ele);
      }
    });
  }

}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);

  getTransFromYoudao(request.word, sendResponse);

  return true;
});