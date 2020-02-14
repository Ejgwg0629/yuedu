'use strict';

// a hack for the gulp-livereload..
// catch the underneath ws request and do reload with chrome.runtime.reload()

const LIVERELOAD_HOST = 'localhost:';
const LIVERELOAD_PORT = 35729;
const connection = new WebSocket('ws://' + LIVERELOAD_HOST + LIVERELOAD_PORT + '/livereload');

var lastReload = false;

chrome.runtime.onInstalled.addListener((details) => {
  lastReload = Date.now();
});    

connection.onerror = (error) => {
  console.log('reload connection got error:', error);
};

connection.onmessage = (e) => {
  if (e.data) {
    const data = JSON.parse(e.data);
    if (data && data.command === 'reload') {
      var currentTime = Date.now();
      // don't reload more than 3s
      if (lastReload && currentTime - lastReload > 3000) {
        
        // actually only the chrome.runtime.reload() works,
        // once runtime reloads, the extension refreshes itself,
        // so developerPrivate.* won't run
        // chrome.runtime.reload();
        chrome.developerPrivate.deleteExtensionErrors({extensionId: chrome.runtime.id});
        chrome.developerPrivate.reload(
          chrome.runtime.id, 
          {failQuietly: true}
        );
      }
    }
  }
};

