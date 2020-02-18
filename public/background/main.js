'use strict';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);

  new Youdao(request.word, sendResponse);

  return true;
});
