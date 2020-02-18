'use strict';

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

    return this.parsePhrsList(response);
  }

  parsePhrsList = (collection) => {
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

}
