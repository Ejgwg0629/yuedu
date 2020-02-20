'use strict';

class Youdao extends Dict {
	constructor(word, sendResponse) {
		super(word, sendResponse);
		this.urlBase = "https://youdao.com/w/";

		var result = this.getTranslationFromCache();
		if (result != null) {
			this.sendResponse(result);
		} else {
			this.translateWord();
		}
	}

	parsePhrsListTab = (phrsList) => {
		if (phrsList == null) {
			return this.fallTo("webTrans");
		}

		Array.from(phrsList.children).forEach(ele => {
			if (ele.localName === "script" || ele.localName === "style") {
				phrsList.removeChild(ele);
			}
		});

		var node;
		try {
			phrsList.querySelectorAll(".pronounce").forEach((ele) => {
				this.pronounces.push({
					style: (node = ele.firstChild) &&
						node.textContent.replace(/^\s+|\s+$/g, "") || "",
					pronounce: (node = ele.querySelector(".phonetic")) &&
						node.textContent.replace(/^\s+|\s+$/g, "") || ""
				})
			});
		} catch(err) {
			console.log(`failed to parse '.pronounce'`);
		}

		try {
			var phrsListTrans = phrsList.querySelector(".trans-container");
			if (phrsListTrans == null) {
				return this.fallTo("WebTrans");
			}
			var lis = phrsListTrans.getElementsByTagName("li");
			Array.from(lis).forEach((ele) => {
				node = (ele.textContent || "").match(/^(\w+\.)(.*)$/);
				if (node != null) {
					this.translations.push({
						PoS: node[1],
						translation: node[2].replace(/^\s+|\s+$/g, "")
					})
				} else {
					this.translations.push({
						PoS: "",
						translation: node.replace(/^\s+|\s+$/g, "")
					})
				}
			});
		} catch (err) {
			console.log(`failed to parse '.trans-container'`);
		}
	}

	parseWebTrans = (webTransList) => {
		if (webTransList == null) {
			return this.sendNotFound();
		}

		var node;
		try {
			webTransList.querySelectorAll(".wt-container").forEach((ele) => {
				this.translations.push({
					PoS: "",
					translation: (node = ele.firstElementChild) &&
						node.textContent.replace(/^\s+|\s+$/g, "") || ""
				})
			})
		} catch(err) {
			console.log(`failed to parse '.wt-container'`);
		}
	}

}
