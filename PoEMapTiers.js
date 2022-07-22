Array.prototype.first = function (propertySelector = obj => obj) {
	return this.filter(propertySelector)[0];
};

$(document).ready(function () {
	apiGetMapData((json) => {
		var runMaps = [];
		var selection = getParameterByName('ids');

		if (selection != null) {
			runMaps = selection.split(",").map(function (item) {
				return parseInt(item, 10);
			})
			runMaps.forEach(function (element) {
				var sels = json.filter(function (item) {
					return item.Id == element;
				});
				sels.forEach(function (sel) {
					sel.run = true;
				});
			});
		}

		json.sort((a, b) => (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0));
		json.sort((a, b) => (a.Tier > b.Tier) ? 1 : ((b.Tier > a.Tier) ? -1 : 0));

		var tiers = [];

		for (i = 1; i <= 16; i++) {
			tiers.push({ Tier: i, Maps: getByTier(json, i) });
		}

		var koModel = {
			Tiers: ko.observableArray(tiers),
			toggleMap: function (item) {
				if (item.run == null) { item.run = false; }
				item.run = !item.run;
				tryRemoveItem(runMaps, item);
				if (item.run == true) {
					$("#btn_" + item.Id).removeClass("btn-outline-success").addClass("btn-outline-secondary");
					runMaps.push(item.Id);
				}
				else {
					$("#btn_" + item.Id).removeClass("btn-outline-secondary").addClass("btn-outline-success");
				}
				var url = window.location.href.replace(window.location.search, '');
				window.history.pushState('page2', 'Title', url + "?ids=" + runMaps.toString());
			}
		};

		var element = $("#dvContainer")[0];
		ko.applyBindings(koModel, element);
	});
});

function apiGetMapData(callback) {
	const url = `https://grvmpr.github.io/tiers.json`;

	const req = new XMLHttpRequest();
	req.open("GET", url, true);
	//req.setRequestHeader("OData-MaxVersion", "4.0");
	//req.setRequestHeader("OData-Version", "4.0");
	req.setRequestHeader("Accept", "application/json");
	req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	//req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
	req.onreadystatechange = function () {
		if (this.readyState === 4) {
			req.onreadystatechange = null;
			if (this.status === 200) {
				const result = JSON.parse(this.response);
				callback(result);
			} else {
				// TODO do error callback
				const xxx = '';
			}
		}
	};
	req.send();
}

function getByTier(list, tier) {
	return list.filter(function (item) {
		return item.Tier == tier;
	});
}

function tryRemoveItem(runMaps, item) {
	const index = runMaps.indexOf(item.Id);
	if (index > -1) {
		runMaps.splice(index, 1);
	}
}

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}