Array.prototype.first = function (propertySelector = obj => obj) {
    return this.filter(propertySelector)[0];
};

const _vm = new MainModel();
var runMaps = [];
const _debugmode = false;

$(document).ready(function () {

    if (_debugmode) { load(); return; }

    apiGetMapDetails((jsonDetails) => {
        _jsonDetails = jsonDetails;
        apiGetMapData((json) => {
            apiGetCardDetails((csv) => {
                console.log(csv);
                _parsedData = parseCsvString(csv);
                _maps = json;
                load();
            });
        });
    });
});

function load() {
    var selection = getParameterByName('ids');

    if (selection != null && selection.length > 0) {
        runMaps = selection.split(",").map(function (item) {
            return parseInt(item, 10);
        })
        runMaps.forEach(function (element) {
            var sels = _maps.filter(function (item) {
                return item.Id == element;
            });
            sels.forEach(function (sel) {
                sel.run = true;
            });
        });
    }

    _maps.sort((a, b) => (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0));
    _maps.sort((a, b) => (a.Tier > b.Tier) ? 1 : ((b.Tier > a.Tier) ? -1 : 0));

    _maps.forEach(function (map, index) {
        map.css = map.run === true ? 'btn-outline-secondary' : 'btn-outline-success';
        map.defaultCss = map.css;
        map.Hover = 'no data available'
        map.Extra = false;
        map.Original = map.Name;
        map.DivCards = [];
        map.Search = map.Name + ' ';

        var divs = _parsedData.filter(function (item) {
            return item[0] == map.Name;
        });

        divs.forEach(function (div) {
            map.Extra = true;
            map.DivCards.push({
                Map: div[0],
                Name: div[1],
                Stack: div[2],
                Reward: div[3],
                Tier: div[4],
                Alert: div[4] == 'GodTier' || div[4] == 'UsefulAF',
                tierCss: div[4] == 'GodTier'
                    ? 'badge text-bg-danger'
                    : div[4] == 'UsefulAF' ? 'badge text-bg-warning' : 'badge text-bg-secondary'
            });

            if (map.CardTier != 'S' && div[4] == 'UsefulAF') { map.CardTier = 'A' }
            if (div[4] == 'GodTier') { map.CardTier = 'S' }
            map.Search = map.Search + div[1] + ' ' + div[3] + ' '
        });

        map.DivCards.sort((a, b) => (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0));

        var sels = _jsonDetails.filter(function (item) {
            return item.Name == map.Name;
        });
        sels.forEach(function (sel) {
            map.Hover = '';
            map.LayoutTier = sel.LayoutTier;
            map.BossNotes = sel.BossNotes;
            map.Original = sel.Name;
            map.LayoutNotes = sel.LayoutNotes;
            map.Extra = true;
            // '♥ ★★★☆☆☠⚠•'
            if (isNullOrUndefined(sel.BossRippy) == false && sel.BossRippy) {
                map.Name = map.Name + ' ☠';
            }
            if (isNullOrUndefined(sel.LayoutTier) == false && (sel.LayoutTier == 'S' || sel.LayoutTier == 'A')) {
                map.Name = map.Name + ' 💞';
            }
        });

        if (isNullOrUndefined(map.CardTier) == false) {
            if (map.CardTier == 'S') {
                map.Name = map.Name + ' ⭐';
            }
            else if (map.CardTier == 'A') {
                map.Name = map.Name + ' ⛛';
            }
            else if (map.CardTier.length > 0) {
                map.Name = map.Name + ' …';
            }
        }

        console.log(map.Search);

        _vm.maps.push(map);
    });

    ko.applyBindings(_vm);
}

function MainModel() {
    var self = this;
    self.maps = ko.observableArray([]);
    self.version = '3.21';
    self.currentFilter = ko.observable('');

    self.rippy = ko.observable(false);
    self.layout = ko.observable(false);
    self.cards = ko.observable(false);

    self.filteredMaps = ko.computed(function () {
        if (self.currentFilter().length == 0) {
            return groupByTier(self.maps());
        }
        else {
            /*
            return groupByTier(ko.utils.arrayFilter(self.maps(), function (map) {
                return map.Name.toLowerCase().includes(self.currentFilter());
            }));
            */
            ko.utils.arrayFilter(self.maps(), function (map) {
                map.highlight = map.Name.toLowerCase().includes(self.currentFilter().toLowerCase()) /* name */
                    || map?.Search?.toLowerCase().includes(self.currentFilter().toLowerCase());

                //map.defaultCss = map.css == 'glow-button' ? map.defaultCss : ''
                map.css = map.highlight ? map.defaultCss + ' glow-button' : map.defaultCss;

                return map.Name.toLowerCase().includes(self.currentFilter());
            });
            return groupByTier(self.maps());
        }
    });

    self.toggleMap = function (item) {
        if (item.run == null) { item.run = false; }
        item.run = !item.run;
        tryRemoveItem(runMaps, item);
        if (item.run == true) {
            $("#btn_" + item.Id).removeClass("btn-outline-success").addClass("btn-outline-secondary");
            $("#btndd_" + item.Id).removeClass("btn-outline-success").addClass("btn-outline-secondary");
            runMaps.push(item.Id);
        }
        else {
            $("#btn_" + item.Id).removeClass("btn-outline-secondary").addClass("btn-outline-success");
            $("#btndd_" + item.Id).removeClass("btn-outline-secondary").addClass("btn-outline-success");
        }
        var url = window.location.href.replace(window.location.search, '');
        window.history.pushState('page2', 'Title', url + "?ids=" + runMaps.toString());
    }
}

function apiGetMapData(callback) {
    const url = `https://grvmpr.github.io/tiers.json`;
    const req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
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
    const req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
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

function apiGetCardDetails(callback) {
    const url = `https://grvmpr.github.io/divcards.csv`;
    const req = new XMLHttpRequest();
    req.open("GET", url, true);
    //req.setRequestHeader("Accept", "application/json");
    //req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                //const result = JSON.parse(this.response);
                callback(this.response);
            } else {
                // TODO do error callback
                const xxx = '';
            }
        }
    };
    req.send();
}

function groupByTier(filtered) {
    var returnList = [];
    filtered.forEach(function (dataRow, index) {
        var sameTier = ko.utils.arrayFilter(returnList, function (item) {
            return item.Tier == dataRow.Tier;
        });

        if (sameTier.length > 0) {
            sameTier[0].Maps.push(dataRow);
        }
        else {
            var css = dataRow.Tier >= 11
                ? 'btn-outline-danger'
                : dataRow.Tier >= 6
                    ? 'btn-outline-warning'
                    : 'btn-outline-secondary';

            var newTier = { Tier: dataRow.Tier, Maps: [], Css: css };

            newTier.Maps.push(dataRow);
            returnList.push(newTier);
        }
    });
    return returnList;
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

function isNullOrUndefined(obj) {
    if (typeof (obj) !== "undefined" && obj !== null) {
        return false;
    }
    else {
        return true;
    }
}

if (_debugmode == false) {
    var parseCsvString = function (csv) {
        let currentCsvIndex = 0;
        let table = [];
        let row = [];
        let currentItem = null;
        while (currentCsvIndex < csv.length) {
            let c = csv[currentCsvIndex];
            currentCsvIndex++;

            switch (c) {
                case ' ':
                    if (currentItem === null) continue;
                    else currentItem += c;
                    break;
                case ',':
                    if (currentItem !== null) currentItem = currentItem.trim();
                    row.push(currentItem);
                    currentItem = null;
                    break;
                case '\r':
                    continue;
                case '\n':
                    if (currentItem !== null) currentItem = currentItem.trim();
                    row.push(currentItem);
                    currentItem = null;
                    table.push(row);
                    row = [];
                    break;
                default:
                    if (currentItem === null) currentItem = c;
                    else currentItem += c;
                    break;
            }
        }
        table.push(row);
        return table;
    };
}
/*
var _maps = [
    { "Name": "Strand", "Id": 1, "Tier": 1 },
    { "Name": "Mausoleum", "Id": 2, "Tier": 1 },
    { "Name": "Lava Lake", "Id": 3, "Tier": 1 },
    { "Name": "Terrace", "Id": 4, "Tier": 1 },
    { "Name": "Moon Temple", "Id": 5, "Tier": 2 },
    { "Name": "Arachnid Tomb", "Id": 6, "Tier": 2 },
    { "Name": "Crimson Temple", "Id": 7, "Tier": 2 },
    { "Name": "Castle Ruins", "Id": 8, "Tier": 2 },
    { "Name": "Cage", "Id": 9, "Tier": 2 },
    { "Name": "Forking River", "Id": 10, "Tier": 2 },
    { "Name": "Spider Forest", "Id": 11, "Tier": 2 },
    { "Name": "Alleyways", "Id": 12, "Tier": 2 },
    { "Name": "Bone Crypt", "Id": 13, "Tier": 3 },
    { "Name": "Museum", "Id": 14, "Tier": 3 },
    { "Name": "Phantasmagoria", "Id": 15, "Tier": 3 },
    { "Name": "Port", "Id": 16, "Tier": 3 },
    { "Name": "Coves", "Id": 17, "Tier": 3 },
    { "Name": "Caldera", "Id": 18, "Tier": 3 },
    { "Name": "Sepulchre", "Id": 19, "Tier": 3 },
    { "Name": "Plateau", "Id": 20, "Tier": 3 },
    { "Name": "Atoll", "Id": 21, "Tier": 4 },
    { "Name": "Shore", "Id": 22, "Tier": 4 },
    { "Name": "Vaal Pyramid", "Id": 23, "Tier": 4 },
    { "Name": "Residence", "Id": 24, "Tier": 4 },
    { "Name": "Coral Ruins", "Id": 25, "Tier": 4 },
    { "Name": "Spider Lair", "Id": 26, "Tier": 4 },
    { "Name": "Thicket", "Id": 27, "Tier": 4 },
    { "Name": "Arachnid Nest", "Id": 28, "Tier": 4 },
    { "Name": "Temple", "Id": 29, "Tier": 5 },
    { "Name": "Courtyard", "Id": 30, "Tier": 5 },
    { "Name": "Acid Caverns", "Id": 31, "Tier": 5 },
    { "Name": "Ivory Temple", "Id": 32, "Tier": 5 },
    { "Name": "Laboratory", "Id": 33, "Tier": 5 },
    { "Name": "Bog", "Id": 34, "Tier": 5 },
    { "Name": "Silo", "Id": 35, "Tier": 5 },
    { "Name": "Pier", "Id": 36, "Tier": 5 },
    { "Name": "Overgrown Shrine", "Id": 37, "Tier": 6 },
    { "Name": "Promenade", "Id": 38, "Tier": 6 },
    { "Name": "Sulphur Vents", "Id": 39, "Tier": 6 },
    { "Name": "Peninsula", "Id": 40, "Tier": 6 },
    { "Name": "Haunted Mansion", "Id": 41, "Tier": 6 },
    { "Name": "Iceberg", "Id": 42, "Tier": 6 },
    { "Name": "Volcano", "Id": 43, "Tier": 6 },
    { "Name": "Necropolis", "Id": 44, "Tier": 7 },
    { "Name": "Precinct", "Id": 45, "Tier": 7 },
    { "Name": "Mineral Pools", "Id": 46, "Tier": 7 },
    { "Name": "Factory", "Id": 47, "Tier": 7 },
    { "Name": "Burial Chambers", "Id": 48, "Tier": 7 },
    { "Name": "Crater", "Id": 49, "Tier": 7 },
    { "Name": "Frozen Cabins", "Id": 50, "Tier": 7 },
    { "Name": "Estuary", "Id": 51, "Tier": 8 },
    { "Name": "Primordial Blocks", "Id": 52, "Tier": 8 },
    { "Name": "Arsenal", "Id": 53, "Tier": 8 },
    { "Name": "Dungeon", "Id": 54, "Tier": 8 },
    { "Name": "Academy", "Id": 55, "Tier": 8 },
    { "Name": "Crimson Township", "Id": 56, "Tier": 8 },
    { "Name": "Leyline", "Id": 57, "Tier": 8 },
    { "Name": "Bazaar", "Id": 58, "Tier": 9 },
    { "Name": "Primordial Pool", "Id": 59, "Tier": 9 },
    { "Name": "Desert", "Id": 60, "Tier": 9 },
    { "Name": "Dark Forest", "Id": 61, "Tier": 9 },
    { "Name": "Colosseum", "Id": 62, "Tier": 9 },
    { "Name": "Arcade", "Id": 63, "Tier": 9 },
    { "Name": "Underground River", "Id": 64, "Tier": 10 },
    { "Name": "Gardens", "Id": 65, "Tier": 10 },
    { "Name": "Forbidden Woods", "Id": 66, "Tier": 10 },
    { "Name": "Grave Trough", "Id": 67, "Tier": 10 },
    { "Name": "Defiled Cathedral", "Id": 68, "Tier": 10 },
    { "Name": "Lookout", "Id": 69, "Tier": 10 },
    { "Name": "Wasteland", "Id": 70, "Tier": 11 },
    { "Name": "City Square", "Id": 71, "Tier": 11 },
    { "Name": "Mesa", "Id": 72, "Tier": 11 },
    { "Name": "Infested Valley", "Id": 73, "Tier": 11 },
    { "Name": "Dry Sea", "Id": 74, "Tier": 11 },
    { "Name": "Villa", "Id": 75, "Tier": 11 },
    { "Name": "Cemetery", "Id": 76, "Tier": 12 },
    { "Name": "Cursed Crypt", "Id": 77, "Tier": 12 },
    { "Name": "Courthouse", "Id": 78, "Tier": 12 },
    { "Name": "Cold River", "Id": 79, "Tier": 12 },
    { "Name": "Colonnade", "Id": 80, "Tier": 12 },
    { "Name": "Shipyard", "Id": 81, "Tier": 12 },
    { "Name": "Lair", "Id": 82, "Tier": 13 },
    { "Name": "Orchard", "Id": 83, "Tier": 13 },
    { "Name": "Shrine", "Id": 84, "Tier": 13 },
    { "Name": "Plaza", "Id": 85, "Tier": 13 },
    { "Name": "Channel", "Id": 86, "Tier": 13 },
    { "Name": "Underground Sea", "Id": 87, "Tier": 14 },
    { "Name": "Maze", "Id": 88, "Tier": 14 },
    { "Name": "Canyon", "Id": 89, "Tier": 14 },
    { "Name": "Sunken City", "Id": 90, "Tier": 14 },
    { "Name": "Carcass", "Id": 91, "Tier": 14 },
    { "Name": "Dunes", "Id": 92, "Tier": 15 },
    { "Name": "Foundry", "Id": 93, "Tier": 15 },
    { "Name": "Overgrown Ruin", "Id": 94, "Tier": 15 },
    { "Name": "Ashen Wood", "Id": 95, "Tier": 15 },
    { "Name": "Grotto", "Id": 96, "Tier": 15 },
    { "Name": "Ancient City", "Id": 97, "Tier": 16 },
    { "Name": "Toxic Sewer", "Id": 98, "Tier": 16 },
    { "Name": "Graveyard", "Id": 99, "Tier": 16 },
    { "Name": "Ghetto", "Id": 100, "Tier": 16 }
];

var _jsonDetails = [
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
        "CardTier": "A",
        "CardNotes": "The Wedding Gift (Arakaali's Fang)",
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
        "CardNotes": "Wealth and Power (Level 4 Enlighten)",
        "BossRippy": true,
        "BossNotes": "RIP"
    },
    {
        "Name": "Crimson Temple",
        "LayoutTier": "C",
        "LayoutNotes": "Indoor",
        "CardTier": "S",
        "CardNotes": "Apothecary T9+ (Mageblood)",
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
        "CardNotes": "Celestial Justicar (6 Link Astral)",
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
        "CardNotes": "The Nurse, Chains That Bind (6 Link Body Armour)",
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
        "CardNotes": "Apothecary T10+ (Mageblood)",
        "BossRippy": true,
        "BossNotes": "RIP"
    },
    {
        "Name": "Atoll",
        "LayoutTier": "A",
        "LayoutNotes": "Circuit",
        "CardTier": "C",
        "CardNotes": "The Spark and The Flame (Berek's Respite)",
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
        "CardNotes": "Unrequited Love (19x Mirror Shard), Arrogance of the Vaal (2 implicit double corrupt unique)",
        "BossRippy": true,
        "BossNotes": "Gear RIP"
    },
    {
        "Name": "Phantasmagoria",
        "LayoutTier": "B",
        "LayoutNotes": "Tight",
        "CardTier": "S",
        "CardNotes": "The Doctor (Headhunter)",
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
        "CardNotes": "Chains That Bind (6 Link Body Armour)",
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
        "CardNotes": "The Enlightened (Level 3 Enlighten)",
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
        "CardNotes": "Apothecary T8+ (Mageblood)",
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
        "Name": "Core",
        "LayoutTier": "A",
        "LayoutNotes": "Tight",
        "CardTier": "A",
        "CardNotes": "Broken Promises (Diamond Ring Item Level 87 Two-Implicit Synthesised)",
        "BossRippy": false,
        "BossNotes": "Multi Boss"
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
        "CardNotes": "The Fiend (Headhunter)",
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
        "CardNotes": "The Spark and The Flame (Berek's Respite)",
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
        "CardNotes": "The Doctor (Headhunter)",
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
        "CardNotes": "The Patient, Dying Anguish (Level 19 Gem Alternate Quality +19%)",
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
        "CardNotes": "Unrequited Love (19x Mirror Shard)",
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
        "CardNotes": "The Sephirot (10x Divine Orb)",
        "BossRippy": false,
        "BossNotes": ""
    },
    {
        "Name": "Sepulchre",
        "LayoutTier": "B",
        "LayoutNotes": "Indoor",
        "CardTier": "S",
        "CardNotes": "The Doctor (Headhunter)",
        "BossRippy": true,
        "BossNotes": ""
    },
    {
        "Name": "Residence",
        "LayoutTier": "C",
        "LayoutNotes": "Indoor",
        "CardTier": "S",
        "CardNotes": "Dapper Prodigy, The Sephirot (10x Divine Orb)",
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
        "CardNotes": "Celestial Justicar (6 Link Astral)",
        "BossRippy": true,
        "BossNotes": "Mech RIP"
    },
    {
        "Name": "Crystal Ore",
        "LayoutTier": "C",
        "LayoutNotes": "Indoor maze",
        "CardTier": "A",
        "CardNotes": "Immortal Resolve (6 Linked Body Armour)",
        "BossRippy": false,
        "BossNotes": "Phased"
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
        "CardNotes": "The Patient, Dying Anguish (Level 19 Gem Alternate Quality +19%)",
        "BossRippy": false,
        "BossNotes": ""
    },
    {
        "Name": "Port",
        "LayoutTier": "B",
        "LayoutNotes": "Linear",
        "CardTier": "S",
        "CardNotes": "Dying Anguish (Level 19 Gem Alternate Quality +19%)",
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
        "CardNotes": "The Patient, Dying Anguish (Level 19 Gem Alternate Quality +19%)",
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
        "CardTier": "S",
        "CardNotes": "The Doctor (Headhunter)",
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
]
*/