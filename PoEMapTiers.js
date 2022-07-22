Array.prototype.first = function (propertySelector = obj => obj) {
	return this.filter(propertySelector)[0];
};

$(document).ready(function () {

	apiGetMapData((json) => {
		console.log(json);
	});

	// -------------- Change here --------------
	var json = [{ "Name": "Underground Sea", "Id": 1, "Tier": 1 }, { "Name": "Arid Lake", "Id": 2, "Tier": 1 }, { "Name": "Spider Forest", "Id": 3, "Tier": 1 }, { "Name": "Cold River", "Id": 4, "Tier": 1 }, { "Name": "Museum", "Id": 5, "Tier": 2 }, { "Name": "Tower", "Id": 6, "Tier": 2 }, { "Name": "Peninsula", "Id": 7, "Tier": 2 }, { "Name": "Dungeon", "Id": 8, "Tier": 2 }, { "Name": "Bog", "Id": 9, "Tier": 2 }, { "Name": "Acid Caverns", "Id": 10, "Tier": 2 }, { "Name": "Frozen Cabins", "Id": 11, "Tier": 2 }, { "Name": "Plaza", "Id": 12, "Tier": 2 }, { "Name": "Moon Temple", "Id": 13, "Tier": 3 }, { "Name": "Necropolis", "Id": 14, "Tier": 3 }, { "Name": "Ramparts", "Id": 15, "Tier": 3 }, { "Name": "Basilica", "Id": 16, "Tier": 3 }, { "Name": "Reef", "Id": 17, "Tier": 3 }, { "Name": "Infested Valley", "Id": 18, "Tier": 3 }, { "Name": "Carcass", "Id": 19, "Tier": 3 }, { "Name": "Volcano", "Id": 20, "Tier": 3 }, { "Name": "Cemetery", "Id": 21, "Tier": 4 }, { "Name": "Overgrown Shrine", "Id": 22, "Tier": 4 }, { "Name": "Temple", "Id": 23, "Tier": 4 }, { "Name": "Bazaar", "Id": 24, "Tier": 4 }, { "Name": "Ashen Wood", "Id": 25, "Tier": 4 }, { "Name": "Arsenal", "Id": 26, "Tier": 4 }, { "Name": "Crimson Temple", "Id": 27, "Tier": 4 }, { "Name": "Armoury", "Id": 28, "Tier": 4 }, { "Name": "Shore", "Id": 29, "Tier": 5 }, { "Name": "Arena", "Id": 30, "Tier": 5 }, { "Name": "Toxic Sewer", "Id": 31, "Tier": 5 }, { "Name": "Dry Sea", "Id": 32, "Tier": 5 }, { "Name": "Arcade", "Id": 33, "Tier": 5 }, { "Name": "Tropical Island", "Id": 34, "Tier": 5 }, { "Name": "Mud Geyser", "Id": 35, "Tier": 5 }, { "Name": "Maze", "Id": 36, "Tier": 5 }, { "Name": "Atoll", "Id": 37, "Tier": 6 }, { "Name": "Bramble Valley", "Id": 38, "Tier": 6 }, { "Name": "Orchard", "Id": 39, "Tier": 6 }, { "Name": "Primordial Pool", "Id": 40, "Tier": 6 }, { "Name": "Summit", "Id": 41, "Tier": 6 }, { "Name": "Crimson Township", "Id": 42, "Tier": 6 }, { "Name": "Lair", "Id": 43, "Tier": 6 }, { "Name": "Bone Crypt", "Id": 44, "Tier": 7 }, { "Name": "Thicket", "Id": 45, "Tier": 7 }, { "Name": "Ivory Temple", "Id": 46, "Tier": 7 }, { "Name": "Sepulchre", "Id": 47, "Tier": 7 }, { "Name": "City Square", "Id": 48, "Tier": 7 }, { "Name": "Lookout", "Id": 49, "Tier": 7 }, { "Name": "Courtyard", "Id": 50, "Tier": 7 }, { "Name": "Mesa", "Id": 51, "Tier": 8 }, { "Name": "Desert Spring", "Id": 52, "Tier": 8 }, { "Name": "Terrace", "Id": 53, "Tier": 8 }, { "Name": "Core", "Id": 54, "Tier": 8 }, { "Name": "Colonnade", "Id": 55, "Tier": 8 }, { "Name": "Desert", "Id": 56, "Tier": 8 }, { "Name": "Gardens", "Id": 57, "Tier": 8 }, { "Name": "Glacier", "Id": 58, "Tier": 9 }, { "Name": "Crystal Ore", "Id": 59, "Tier": 9 }, { "Name": "Grotto", "Id": 60, "Tier": 9 }, { "Name": "Lava Chamber", "Id": 61, "Tier": 9 }, { "Name": "Promenade", "Id": 62, "Tier": 9 }, { "Name": "Overgrown Ruin", "Id": 63, "Tier": 9 }, { "Name": "Dunes", "Id": 64, "Tier": 10 }, { "Name": "Marshes", "Id": 65, "Tier": 10 }, { "Name": "Waste Pool", "Id": 66, "Tier": 10 }, { "Name": "Jungle Valley", "Id": 67, "Tier": 10 }, { "Name": "Canyon", "Id": 68, "Tier": 10 }, { "Name": "Mausoleum", "Id": 69, "Tier": 10 }, { "Name": "Villa", "Id": 70, "Tier": 11 }, { "Name": "Wharf", "Id": 71, "Tier": 11 }, { "Name": "Precinct", "Id": 72, "Tier": 11 }, { "Name": "Cage", "Id": 73, "Tier": 11 }, { "Name": "Dark Forest", "Id": 74, "Tier": 11 }, { "Name": "Grave Trough", "Id": 75, "Tier": 11 }, { "Name": "Underground River", "Id": 76, "Tier": 12 }, { "Name": "Vaal Pyramid", "Id": 77, "Tier": 12 }, { "Name": "Mineral Pools", "Id": 78, "Tier": 12 }, { "Name": "Pit", "Id": 79, "Tier": 12 }, { "Name": "Foundry", "Id": 80, "Tier": 12 }, { "Name": "Port", "Id": 81, "Tier": 12 }, { "Name": "Sunken City", "Id": 82, "Tier": 13 }, { "Name": "Laboratory", "Id": 83, "Tier": 13 }, { "Name": "Coral Ruins", "Id": 84, "Tier": 13 }, { "Name": "Factory", "Id": 85, "Tier": 13 }, { "Name": "Wasteland", "Id": 86, "Tier": 13 }, { "Name": "Strand", "Id": 87, "Tier": 14 }, { "Name": "Alleyways", "Id": 88, "Tier": 14 }, { "Name": "Beach", "Id": 89, "Tier": 14 }, { "Name": "Fields", "Id": 90, "Tier": 14 }, { "Name": "Fungal Hollow", "Id": 91, "Tier": 14 }, { "Name": "Cursed Crypt", "Id": 92, "Tier": 15 }, { "Name": "Palace", "Id": 93, "Tier": 15 }, { "Name": "Cells", "Id": 94, "Tier": 15 }, { "Name": "Barrows", "Id": 95, "Tier": 15 }, { "Name": "Park", "Id": 96, "Tier": 15 }, { "Name": "Lava Lake", "Id": 97, "Tier": 16 }, { "Name": "Burial Chambers", "Id": 98, "Tier": 16 }, { "Name": "Residence", "Id": 99, "Tier": 16 }, { "Name": "Caldera", "Id": 100, "Tier": 16 }];
	// -----------------------------------------
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