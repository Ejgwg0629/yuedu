'use strict';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  new Youdao(request.word, sendResponse);

  return true;
});
