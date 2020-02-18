'use strict';

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
