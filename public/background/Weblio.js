'use strict';

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