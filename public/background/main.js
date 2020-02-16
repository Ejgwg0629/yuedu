'use strict';

chrome.runtime.onInstalled.addListener(function () {
  console.log("every time runtime.reload");
});

function getTrans(url, sendResponse) {
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

function getTransFromYoudao(url, sendResponse) {
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
        language: ele.firstChild.textContent.replace(/^\s+|\s+$/g, ""),
        pronounce: ele.querySelector(".phonetic").textContent.replace(/^\s+|\s+$/g, "")
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
  } catch(err) {
    return {
      translations: []
    }
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);


  getTransFromYoudao(request.msg, sendResponse);

  return true;
});