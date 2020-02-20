'use strict';

class Dict {
	constructor(word, sendResponse) {
		this.word = this.normalize(word);
		this.sendResponse = sendResponse;

		this.pronounces = [];
		this.translations = [];
		this.result = {
			word: this.word,
			status: "initiating",
			dict: "",
			pronounces: this.pronounces,
			translations: this.translations,
			message: ""
		}
	}

	normalize = (word) => {
		// TODO: assert word is a string
		word = word.replace(/^\s+|\s+$/, "");
		word = word.replace(/\s+/g, " ");
		return word;
	}

	getTranslationFromCache = () => {
		// TODO: get translation from LocalStorage
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
					this.doc = parser.parseFromString(xhr.response, "text/html");
					this.fallTo("phrsListTab");
					this.sendResponse(this.result);
				} catch (err) {
					this.sendParseError();
				}
			}
		};
		xhr.onerror = () => {
			this.sendOnError();
		};
		xhr.send();
	}

	fallTo = (select) => {
		var doc = this.doc;
		var trans;
		if (/^[#\.]/.test(select)) {
			trans = doc.querySelector(select);
			select = select.substring(1);
		} else if (/^\w/.test(select)) {
			trans = doc.getElementById(select);
		} else {
			return this.sendFallToError();
		}

		try {
			var parser = this["parse" + select.charAt(0).toUpperCase() + select.slice(1)];
			parser(trans);
		} catch(err) {
			return this.sendFallToError();
		}
	}

	sendNotFound = () => {
		this.result.status = "failed";
		this.result.message = `not found the meaning`
		this.sendResponse(this.result);
	}

	sendParseError = () => {
		this.result.status = "failed";
		this.result.message = `failed to parse the page`
		this.sendResponse(this.result);
	}

	sendOnError = () => {
		this.result.status = "failed";
		this.result.message = `network error ..?`
		this.sendResponse(this.result);
	}

	sendFallToError = () => {
		this.result.status = "failed";
		this.result.message = `fallTo error..`
		this.sendResponse(this.result);
	}
}
