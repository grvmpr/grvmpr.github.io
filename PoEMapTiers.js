Array.prototype.first = function (propertySelector = obj => obj) {
	return this.filter(propertySelector)[0];
};

$(document).ready(function () {
	apiGetMapDetails((jsonDetails) => {
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

			json.forEach(function (map) {
				var sels = jsonDetails.filter(function (item) {
					return item.Name == map.Name;
				});
				sels.forEach(function (sel) {
					map.LayoutTier = sel.LayoutTier;
					map.LayoutTier = sel.LayoutNotes;
					map.LayoutTier = sel.CardTier;
					map.LayoutTier = sel.CardNotes;
					map.LayoutTier = sel.BossRippy;
					map.LayoutTier = sel.BossNotes;
					map.Hover = '';

					// '♥ ★★★☆☆☠⚠•'
					if (isNullOrUndefined(sel.BossRippy) == false && sel.BossRippy) {
						map.Name = map.Name + ' ☠';
					}
					if (isNullOrUndefined(sel.LayoutTier) == false && (sel.LayoutTier == 'S' || sel.LayoutTier == 'A')) {
						map.Name = map.Name + ' ♥';
					}
					if (isNullOrUndefined(sel.CardTier) == false) {
						if (sel.CardTier == 'S' || sel.CardTier == 'A') {
							map.Name = map.Name + ' ★';
						}
						else if (sel.CardTier.length > 0) {
							map.Name = map.Name + ' …';
						}
					}
					if (isNullOrUndefined(sel.LayoutTier) == false && sel.LayoutTier.length > 0) {
						map.Hover = map.Hover + sel.LayoutNotes;
					}
					if (isNullOrUndefined(sel.CardNotes) == false && sel.CardNotes.length > 0) {
						map.Hover = map.Hover + ' • ' + sel.CardNotes;
					}
					if (isNullOrUndefined(sel.BossNotes) == false && sel.BossNotes.length > 0) {
						map.Hover = map.Hover + ' • ' + sel.BossNotes;
					}
				});
			});

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

			//$('[data-toggle="popover"]').popover();
			//var $j = jQuery.noConflict();

			//$j(document).ready(function() {
			//	$j('[data-toggle="popover"]').popover();
			//});
		});
	});
});

function apiGetMapData(callback) {
	const url = `https://grvmpr.github.io/tiers.json`;

	//callback(localMaps);
	//return;

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

function apiGetMapDetails(callback) {
	const url = `https://grvmpr.github.io/info.json`;

	//callback(localMapData);
	//return;

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

function isNullOrUndefined(obj) {
	if (typeof(obj) !== "undefined" && obj !== null ) {
		return false;
	}
	else {
		return true;
	}
}

function getByTier(list, tier) {
	return list.filter(function (item) {
		return item.Tier == tier;
	});
}

function getByName(list, name) {
	return list.filter(function (item) {
		return item.Name == name;
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

// { "Name": "Strand", "LayoutTier": "", "LayoutNotes": "", "CardTier": "", "CardNotes": "", "BossRippy": false, "BossNotes": ""  }
/*
let localMapData = [
	{
	  "Name": "Strand",
	  "LayoutTier": "S",
	  "LayoutNotes": "Linear",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Overgrown Ruin",
	  "LayoutTier": "C",
	  "LayoutNotes": "Indoor",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Phased gear"
	},
	{
	  "Name": "Terrace",
	  "LayoutTier": "B",
	  "LayoutNotes": "Windy",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Phased mech"
	},
	{
	  "Name": "Frozen Cabins",
	  "LayoutTier": "C",
	  "LayoutNotes": "Windy",
	  "CardTier": "C",
	  "CardNotes": "Humility",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Moon Temple",
	  "LayoutTier": "C",
	  "LayoutNotes": "Open Maze",
	  "CardTier": "C",
	  "CardNotes": "Wealth and Power",
	  "BossRippy": true,
	  "BossNotes": "RIP"
	},
	{
	  "Name": "Crimson Temple",
	  "LayoutTier": "C",
	  "LayoutNotes": "Indoor",
	  "CardTier": "S",
	  "CardNotes": "Apothecary T9+ & more",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Carcass",
	  "LayoutTier": "D",
	  "LayoutNotes": "Indoor",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Phased gear"
	},
	{
	  "Name": "Dark Forest",
	  "LayoutTier": "B",
	  "LayoutNotes": "Open",
	  "CardTier": "C",
	  "CardNotes": "SSF - Coruscating Elixir",
	  "BossRippy": true,
	  "BossNotes": "Phased mech gear RIP"
	},
	{
	  "Name": "Colosseum",
	  "LayoutTier": "D",
	  "LayoutNotes": "Tight",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Phased mech"
	},
	{
	  "Name": "Bramble Valley",
	  "LayoutTier": "C",
	  "LayoutNotes": "Windy",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": true,
	  "BossNotes": "Phased mech gear RIP"
	},
	{
	  "Name": "Excavation",
	  "LayoutTier": "C",
	  "LayoutNotes": "Indoor",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Thicket",
	  "LayoutTier": "C",
	  "LayoutNotes": "Indoor",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Bone Crypt",
	  "LayoutTier": "D",
	  "LayoutNotes": "Indoor",
	  "CardTier": "C",
	  "CardNotes": "Celestial Justicar",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Museum",
	  "LayoutTier": "D",
	  "LayoutNotes": "Indoor",
	  "CardTier": "C",
	  "CardNotes": "Academic",
	  "BossRippy": false,
	  "BossNotes": "Gear"
	},
	{
	  "Name": "Waterways",
	  "LayoutTier": "B",
	  "LayoutNotes": "Constant",
	  "CardTier": "C",
	  "CardNotes": "Humility",
	  "BossRippy": false,
	  "BossNotes": "Phased"
	},
	{
	  "Name": "Factory",
	  "LayoutTier": "D",
	  "LayoutNotes": "Indoor",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": true,
	  "BossNotes": "Mech RIP"
	},
	{
	  "Name": "Cells",
	  "LayoutTier": "F",
	  "LayoutNotes": "Indoor maze",
	  "CardTier": "B",
	  "CardNotes": "The Nurse Chains That Bind",
	  "BossRippy": true,
	  "BossNotes": "RIP"
	},
	{
	  "Name": "Caldera",
	  "LayoutTier": "B",
	  "LayoutNotes": "Long windy",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Gear"
	},
	{
	  "Name": "Park",
	  "LayoutTier": "A",
	  "LayoutNotes": "Open",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Gear"
	},
	{
	  "Name": "Defiled Cathedral",
	  "LayoutTier": "B",
	  "LayoutNotes": "Circuit",
	  "CardTier": "S",
	  "CardNotes": "Apothecary T10+ & more",
	  "BossRippy": true,
	  "BossNotes": "RIP"
	},
	{
	  "Name": "Atoll",
	  "LayoutTier": "A",
	  "LayoutNotes": "Circuit",
	  "CardTier": "C",
	  "CardNotes": "The Spark and The Flame",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Shore",
	  "LayoutTier": "S",
	  "LayoutNotes": "Outdoor",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Vaal Pyramid",
	  "LayoutTier": "D",
	  "LayoutNotes": "Indoor maze",
	  "CardTier": "B",
	  "CardNotes": "Unrequited Love",
	  "BossRippy": true,
	  "BossNotes": "Gear RIP"
	},
	{
	  "Name": "Phantasmagoria",
	  "LayoutTier": "B",
	  "LayoutNotes": "Tight",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": true,
	  "BossNotes": "RIP"
	},
	{
	  "Name": "Primordial Pool",
	  "LayoutTier": "B",
	  "LayoutNotes": "Outdoor",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Laboratory",
	  "LayoutTier": "D",
	  "LayoutNotes": "Backtrack",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Phased Mech"
	},
	{
	  "Name": "Dungeon",
	  "LayoutTier": "F",
	  "LayoutNotes": "Indoor maze",
	  "CardTier": "C",
	  "CardNotes": "Chains That Bind",
	  "BossRippy": true,
	  "BossNotes": "RIP"
	},
	{
	  "Name": "Chateau",
	  "LayoutTier": "C",
	  "LayoutNotes": "Circuit",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Temple",
	  "LayoutTier": "C",
	  "LayoutNotes": "Indoor",
	  "CardTier": "C",
	  "CardNotes": "The Enlightened",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Crater",
	  "LayoutTier": "B",
	  "LayoutNotes": "Tight",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Gear"
	},
	{
	  "Name": "Crimson Township",
	  "LayoutTier": "C",
	  "LayoutNotes": "Windy",
	  "CardTier": "S",
	  "CardNotes": "Apothecary T8+",
	  "BossRippy": true,
	  "BossNotes": "Gear RIP both very much so"
	},
	{
	  "Name": "Wharf",
	  "LayoutTier": "A",
	  "LayoutNotes": "Outdoor",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Coral Ruins",
	  "LayoutTier": "F",
	  "LayoutNotes": "Outdoor maze",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Phased"
	},
	{
	  "Name": "Mud Geyser",
	  "LayoutTier": "A",
	  "LayoutNotes": "Circuit",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Phased (burrow)"
	},
	{
	  "Name": "Acid Caverns",
	  "LayoutTier": "C",
	  "LayoutNotes": "Circuit indoor",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": true,
	  "BossNotes": "Mech Gear RIP"
	},
	{
	  "Name": "Shrine",
	  "LayoutTier": "D",
	  "LayoutNotes": "Indoor maze",
	  "CardTier": "A",
	  "CardNotes": "The Fiend",
	  "BossRippy": false,
	  "BossNotes": "Phased gear"
	},
	{
	  "Name": "Overgrown Shrine",
	  "LayoutTier": "C",
	  "LayoutNotes": "Indoor",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": true,
	  "BossNotes": "Phased mech gear RIP"
	},
	{
	  "Name": "Lava Chamber",
	  "LayoutTier": "D",
	  "LayoutNotes": "Indoor maze",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Gear"
	},
	{
	  "Name": "Jungle Valley",
	  "LayoutTier": "A",
	  "LayoutNotes": "Open obstacles",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Phased"
	},
	{
	  "Name": "Arachnid Tomb",
	  "LayoutTier": "C",
	  "LayoutNotes": "Indoor",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Plateau",
	  "LayoutTier": "A",
	  "LayoutNotes": "Open circuit",
	  "CardTier": "C",
	  "CardNotes": "The Spark and The Flame",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Dry Sea",
	  "LayoutTier": "C",
	  "LayoutNotes": "Circuit",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Spider Forest",
	  "LayoutTier": "D",
	  "LayoutNotes": "Outdoor maze",
	  "CardTier": "A",
	  "CardNotes": "The Doctor",
	  "BossRippy": true,
	  "BossNotes": "RIP"
	},
	{
	  "Name": "Necropolis",
	  "LayoutTier": "D",
	  "LayoutNotes": "Indoor maze",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": true,
	  "BossNotes": "Mech RIP"
	},
	{
	  "Name": "Colonnade",
	  "LayoutTier": "A",
	  "LayoutNotes": "Linear",
	  "CardTier": "B",
	  "CardNotes": "The Patient Dying Anguish",
	  "BossRippy": true,
	  "BossNotes": "Phased mech gear RIP"
	},
	{
	  "Name": "Arachnid Nest",
	  "LayoutTier": "D",
	  "LayoutNotes": "Indoor maze",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Phased"
	},
	{
	  "Name": "Lair",
	  "LayoutTier": "B",
	  "LayoutNotes": "Windy indoor",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": true,
	  "BossNotes": "Phased mech gear RIP"
	},
	{
	  "Name": "Mausoleum",
	  "LayoutTier": "B",
	  "LayoutNotes": "Circuit",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": true,
	  "BossNotes": "RIP"
	},
	{
	  "Name": "Summit",
	  "LayoutTier": "B",
	  "LayoutNotes": "Open",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": true,
	  "BossNotes": "Phased mech RIP"
	},
	{
	  "Name": "Fungal Hollow",
	  "LayoutTier": "B",
	  "LayoutNotes": "Circuit",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Gear"
	},
	{
	  "Name": "Wasteland",
	  "LayoutTier": "C",
	  "LayoutNotes": "Open",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Gear"
	},
	{
	  "Name": "Bog",
	  "LayoutTier": "A",
	  "LayoutNotes": "Open",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Ancient City",
	  "LayoutTier": "C",
	  "LayoutNotes": "Outdoor maze",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Ghetto",
	  "LayoutTier": "C",
	  "LayoutNotes": "Outdoor maze",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": true,
	  "BossNotes": "RIP"
	},
	{
	  "Name": "Maze",
	  "LayoutTier": "F",
	  "LayoutNotes": "Indoor maze",
	  "CardTier": "B",
	  "CardNotes": "Unrequited Love",
	  "BossRippy": true,
	  "BossNotes": "Phased RIP"
	},
	{
	  "Name": "Barrows",
	  "LayoutTier": "C",
	  "LayoutNotes": "Varied",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Canyon",
	  "LayoutTier": "S",
	  "LayoutNotes": "Linear",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": true,
	  "BossNotes": "RIP"
	},
	{
	  "Name": "Villa",
	  "LayoutTier": "C",
	  "LayoutNotes": "Indoor",
	  "CardTier": "B",
	  "CardNotes": "The Sephirot",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Residence",
	  "LayoutTier": "C",
	  "LayoutNotes": "Indoor",
	  "CardTier": "A",
	  "CardNotes": "Dapper Prodigy",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Foundry",
	  "LayoutTier": "B",
	  "LayoutNotes": "Circuit",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": true,
	  "BossNotes": "RIP"
	},
	{
	  "Name": "Pier",
	  "LayoutTier": "B",
	  "LayoutNotes": "Outdoor windy",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Dig",
	  "LayoutTier": "A",
	  "LayoutNotes": "Open obstacles",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Phased mech"
	},
	{
	  "Name": "Desert",
	  "LayoutTier": "C",
	  "LayoutNotes": "Open",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Underground River",
	  "LayoutTier": "B",
	  "LayoutNotes": "Windy",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": true,
	  "BossNotes": "RIP"
	},
	{
	  "Name": "Cold River",
	  "LayoutTier": "C",
	  "LayoutNotes": "Circuit",
	  "CardTier": "C",
	  "CardNotes": "Twilight Temple (SSF)",
	  "BossRippy": true,
	  "BossNotes": "Mech Gear RIP"
	},
	{
	  "Name": "Stagnation",
	  "LayoutTier": "F",
	  "LayoutNotes": "Outdoor maze",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": true,
	  "BossNotes": "Mech RIP"
	},
	{
	  "Name": "Racecourse",
	  "LayoutTier": "A",
	  "LayoutNotes": "Circuit x2",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Gardens",
	  "LayoutTier": "D",
	  "LayoutNotes": "Linear but messy",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Phased. DO NOT make boss metamorph"
	},
	{
	  "Name": "Leyline",
	  "LayoutTier": "C",
	  "LayoutNotes": "Open",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Phased"
	},
	{
	  "Name": "Alleyways",
	  "LayoutTier": "B",
	  "LayoutNotes": "Mostly linear",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Peninsula",
	  "LayoutTier": "A",
	  "LayoutNotes": "Open",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Arena",
	  "LayoutTier": "F",
	  "LayoutNotes": "Indoor maze",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Gear"
	},
	{
	  "Name": "Castle Ruins",
	  "LayoutTier": "B",
	  "LayoutNotes": "Open",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Gear"
	},
	{
	  "Name": "Belfry",
	  "LayoutTier": "B",
	  "LayoutNotes": "Open",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": true,
	  "BossNotes": "Phased mech RIP"
	},
	{
	  "Name": "Precinct",
	  "LayoutTier": "C",
	  "LayoutNotes": "Open can get lost",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": true,
	  "BossNotes": "Gear RIP"
	},
	{
	  "Name": "Cemetery",
	  "LayoutTier": "A",
	  "LayoutNotes": "Open",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Mech"
	},
	{
	  "Name": "Cursed Crypt",
	  "LayoutTier": "D",
	  "LayoutNotes": "Indoor maze",
	  "CardTier": "C",
	  "CardNotes": "Celestial Justicar",
	  "BossRippy": true,
	  "BossNotes": "Mech RIP"
	},
	{
	  "Name": "Marshes",
	  "LayoutTier": "B",
	  "LayoutNotes": "Open can get lost",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Gear"
	},
	{
	  "Name": "Promenade",
	  "LayoutTier": "A",
	  "LayoutNotes": "Linear",
	  "CardTier": "B",
	  "CardNotes": "The Patient Dying Anguish",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Port",
	  "LayoutTier": "B",
	  "LayoutNotes": "Linear",
	  "CardTier": "S",
	  "CardNotes": "Dying Anguish",
	  "BossRippy": false,
	  "BossNotes": "Phased gear (bleeds)"
	},
	{
	  "Name": "Silo",
	  "LayoutTier": "B",
	  "LayoutNotes": "Linear",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Phased"
	},
	{
	  "Name": "Arsenal",
	  "LayoutTier": "F",
	  "LayoutNotes": "Outdoor maze",
	  "CardTier": "B",
	  "CardNotes": "The Patient Dying Anguish",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Lava Lake",
	  "LayoutTier": "B",
	  "LayoutNotes": "Open dead ends",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": true,
	  "BossNotes": "Phased gear mech RIP"
	},
	{
	  "Name": "Orchard",
	  "LayoutTier": "C",
	  "LayoutNotes": "Open maze",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Mech"
	},
	{
	  "Name": "Pen",
	  "LayoutTier": "C",
	  "LayoutNotes": "Windy",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Sulphur Vents",
	  "LayoutTier": "B",
	  "LayoutNotes": "Open",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Underground Sea",
	  "LayoutTier": "C",
	  "LayoutNotes": "Indoor maze",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Phased mech"
	},
	{
	  "Name": "Plaza",
	  "LayoutTier": "F",
	  "LayoutNotes": "Maze",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Mech"
	},
	{
	  "Name": "Mesa",
	  "LayoutTier": "A",
	  "LayoutNotes": "Circuit",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Gear"
	},
	{
	  "Name": "Armoury",
	  "LayoutTier": "B",
	  "LayoutNotes": "Circuit",
	  "CardTier": "B",
	  "CardNotes": "The Patient",
	  "BossRippy": true,
	  "BossNotes": "Gear RIP"
	},
	{
	  "Name": "Ashen Wood",
	  "LayoutTier": "A",
	  "LayoutNotes": "Open",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Dunes",
	  "LayoutTier": "A",
	  "LayoutNotes": "Open",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Forking River",
	  "LayoutTier": "C",
	  "LayoutNotes": "Linear but messy",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": true,
	  "BossNotes": "Mech RIP"
	},
	{
	  "Name": "Vault",
	  "LayoutTier": "C",
	  "LayoutNotes": "Circuit",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Grotto",
	  "LayoutTier": "B",
	  "LayoutNotes": "Circuit",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Arcade",
	  "LayoutTier": "C",
	  "LayoutNotes": "Open obstacles",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Waste Pool",
	  "LayoutTier": "A",
	  "LayoutNotes": "Indoor circuit",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": "Phased mech"
	},
	{
	  "Name": "Grave Trough",
	  "LayoutTier": "D",
	  "LayoutNotes": "Lots of levels",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": true,
	  "BossNotes": "Mech RIP"
	},
	{
	  "Name": "Ramparts",
	  "LayoutTier": "B",
	  "LayoutNotes": "Linear",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	},
	{
	  "Name": "Arid Lake",
	  "LayoutTier": "A",
	  "LayoutNotes": "Open",
	  "CardTier": "",
	  "CardNotes": "",
	  "BossRippy": false,
	  "BossNotes": ""
	}
  ];

let localMaps = [
	{ "Name": "Strand", "Id": 1, "Tier": 1 },
	{ "Name": "Overgrown Ruin", "Id": 2, "Tier": 1 },
	{ "Name": "Terrace", "Id": 3, "Tier": 1 },
	{ "Name": "Frozen Cabins", "Id": 4, "Tier": 1 },
	{ "Name": "Moon Temple", "Id": 5, "Tier": 2 },
	{ "Name": "Crimson Temple", "Id": 6, "Tier": 2 },
	{ "Name": "Carcass", "Id": 7, "Tier": 2 },
	{ "Name": "Dark Forest", "Id": 8, "Tier": 2 },
	{ "Name": "Colosseum", "Id": 9, "Tier": 2 },
	{ "Name": "Bramble Valley", "Id": 10, "Tier": 2 },
	{ "Name": "Excavation", "Id": 11, "Tier": 2 },
	{ "Name": "Thicket", "Id": 12, "Tier": 2 },
	{ "Name": "Bone Crypt", "Id": 13, "Tier": 3 },
	{ "Name": "Museum", "Id": 14, "Tier": 3 },
	{ "Name": "Waterways", "Id": 15, "Tier": 3 },
	{ "Name": "Factory", "Id": 16, "Tier": 3 },
	{ "Name": "Cells", "Id": 17, "Tier": 3 },
	{ "Name": "Caldera", "Id": 18, "Tier": 3 },
	{ "Name": "Park", "Id": 19, "Tier": 3 },
	{ "Name": "Defiled Cathedral", "Id": 20, "Tier": 3 },
	{ "Name": "Atoll", "Id": 21, "Tier": 4 },
	{ "Name": "Shore", "Id": 22, "Tier": 4 },
	{ "Name": "Vaal Pyramid", "Id": 23, "Tier": 4 },
	{ "Name": "Phantasmagoria", "Id": 24, "Tier": 4 },
	{ "Name": "Primordial Pool", "Id": 25, "Tier": 4 },
	{ "Name": "Laboratory", "Id": 26, "Tier": 4 },
	{ "Name": "Dungeon", "Id": 27, "Tier": 4 },
	{ "Name": "Chateau", "Id": 28, "Tier": 4 },
	{ "Name": "Temple", "Id": 29, "Tier": 5 },
	{ "Name": "Crater", "Id": 30, "Tier": 5 },
	{ "Name": "Crimson Township", "Id": 31, "Tier": 5 },
	{ "Name": "Wharf", "Id": 32, "Tier": 5 },
	{ "Name": "Coral Ruins", "Id": 33, "Tier": 5 },
	{ "Name": "Mud Geyser", "Id": 34, "Tier": 5 },
	{ "Name": "Acid Caverns", "Id": 35, "Tier": 5 },
	{ "Name": "Shrine", "Id": 36, "Tier": 5 },
	{ "Name": "Overgrown Shrine", "Id": 37, "Tier": 6 },
	{ "Name": "Lava Chamber", "Id": 38, "Tier": 6 },
	{ "Name": "Jungle Valley", "Id": 39, "Tier": 6 },
	{ "Name": "Arachnid Tomb", "Id": 40, "Tier": 6 },
	{ "Name": "Plateau", "Id": 41, "Tier": 6 },
	{ "Name": "Dry Sea", "Id": 42, "Tier": 6 },
	{ "Name": "Spider Forest", "Id": 43, "Tier": 6 },
	{ "Name": "Necropolis", "Id": 44, "Tier": 7 },
	{ "Name": "Colonnade", "Id": 45, "Tier": 7 },
	{ "Name": "Arachnid Nest", "Id": 46, "Tier": 7 },
	{ "Name": "Lair", "Id": 47, "Tier": 7 },
	{ "Name": "Mausoleum", "Id": 48, "Tier": 7 },
	{ "Name": "Summit", "Id": 49, "Tier": 7 },
	{ "Name": "Fungal Hollow", "Id": 50, "Tier": 7 },
	{ "Name": "Wasteland", "Id": 51, "Tier": 8 },
	{ "Name": "Bog", "Id": 52, "Tier": 8 },
	{ "Name": "Ancient City", "Id": 53, "Tier": 8 },
	{ "Name": "Ghetto", "Id": 54, "Tier": 8 },
	{ "Name": "Maze", "Id": 55, "Tier": 8 },
	{ "Name": "Barrows", "Id": 56, "Tier": 8 },
	{ "Name": "Canyon", "Id": 57, "Tier": 8 },
	{ "Name": "Villa", "Id": 58, "Tier": 9 },
	{ "Name": "Residence", "Id": 59, "Tier": 9 },
	{ "Name": "Foundry", "Id": 60, "Tier": 9 },
	{ "Name": "Pier", "Id": 61, "Tier": 9 },
	{ "Name": "Dig", "Id": 62, "Tier": 9 },
	{ "Name": "Desert", "Id": 63, "Tier": 9 },
	{ "Name": "Underground River", "Id": 64, "Tier": 10 },
	{ "Name": "Cold River", "Id": 65, "Tier": 10 },
	{ "Name": "Stagnation", "Id": 66, "Tier": 10 },
	{ "Name": "Racecourse", "Id": 67, "Tier": 10 },
	{ "Name": "Gardens", "Id": 68, "Tier": 10 },
	{ "Name": "Leyline", "Id": 69, "Tier": 10 },
	{ "Name": "Alleyways", "Id": 70, "Tier": 11 },
	{ "Name": "Peninsula", "Id": 71, "Tier": 11 },
	{ "Name": "Arena", "Id": 72, "Tier": 11 },
	{ "Name": "Castle Ruins", "Id": 73, "Tier": 11 },
	{ "Name": "Belfry", "Id": 74, "Tier": 11 },
	{ "Name": "Precinct", "Id": 75, "Tier": 11 },
	{ "Name": "Cemetery", "Id": 76, "Tier": 12 },
	{ "Name": "Cursed Crypt", "Id": 77, "Tier": 12 },
	{ "Name": "Marshes", "Id": 78, "Tier": 12 },
	{ "Name": "Promenade", "Id": 79, "Tier": 12 },
	{ "Name": "Port", "Id": 80, "Tier": 12 },
	{ "Name": "Silo", "Id": 81, "Tier": 12 },
	{ "Name": "Arsenal", "Id": 82, "Tier": 13 },
	{ "Name": "Lava Lake", "Id": 83, "Tier": 13 },
	{ "Name": "Orchard", "Id": 84, "Tier": 13 },
	{ "Name": "Pen", "Id": 85, "Tier": 13 },
	{ "Name": "Sulphur Vents", "Id": 86, "Tier": 13 },
	{ "Name": "Underground Sea", "Id": 87, "Tier": 14 },
	{ "Name": "Plaza", "Id": 88, "Tier": 14 },
	{ "Name": "Mesa", "Id": 89, "Tier": 14 },
	{ "Name": "Armoury", "Id": 90, "Tier": 14 },
	{ "Name": "Ashen Wood", "Id": 91, "Tier": 14 },
	{ "Name": "Dunes", "Id": 92, "Tier": 15 },
	{ "Name": "Forking River", "Id": 93, "Tier": 15 },
	{ "Name": "Vault", "Id": 94, "Tier": 15 },
	{ "Name": "Grotto", "Id": 95, "Tier": 15 },
	{ "Name": "Arcade", "Id": 96, "Tier": 15 },
	{ "Name": "Waste Pool", "Id": 97, "Tier": 16 },
	{ "Name": "Grave Trough", "Id": 98, "Tier": 16 },
	{ "Name": "Ramparts", "Id": 99, "Tier": 16 },
	{ "Name": "Arid Lake", "Id": 100, "Tier": 16 }
  ];  
  */