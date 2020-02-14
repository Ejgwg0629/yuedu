'use strict';

chrome.runtime.onInstalled.addListener(function() {
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);

//   fetch(request.msg)
//   .then(response => {
//       console.log(response);
//       sendResponse("200");
//   })
  
  getTrans(request.msg, sendResponse);

  return true;
});