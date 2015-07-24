require('./@config.js');


// -------------------------------------------------------------------------- //
// Формирование взвешанного графа белковых связей организма
var genesline = {};
var data2k = fs.readFileSync('net/@ways2k.txt', 'utf8').split("\n");
var data4k = fs.readFileSync('net/@ways4k.txt', 'utf8').split("\n");
var roots2k = fs.readFileSync('net/@roots2k.txt', 'utf8').split("\n");
var roots4k = fs.readFileSync('net/@roots4k.txt', 'utf8').split("\n");

for (var i in roots2k) genesline[roots2k[i]] = {};
for (var i in roots4k) genesline[roots4k[i]] = {};

for (var i in data2k) {
	var line = data2k[i].split('\t');
	if (line[0] == 'C') {
		var gid = line[3];
		var score = line[5]/10;
		var connected = line[4].split(' ');
		for (var cc in connected) {
			//if (connected[cc] != '' && !genesline[connected[cc]]) {
			if (connected[cc] != '') {
				var ccid = connected[cc];
				if (!genesline[gid][ccid]) genesline[gid][ccid] = score;
			}
		}
	}
}

for (var i in data4k) {
	var line = data4k[i].split('\t');
	if (line[0] == 'C') {
		var gid = line[3];
		var score = line[5]/10;
		var connected = line[4].split(' ');
		for (var cc in connected) {
			//if (connected[cc] != '' && !genesline[connected[cc]]) {
			if (connected[cc] != '') {
				var ccid = connected[cc];
				if (!genesline[gid][ccid]) genesline[gid][ccid] = score;
			}
		}
	}
}

// -------------------------------------------------------------------------- //
// Разделение на тестовую и обучающую выборки
// Этот шаг можно пропустить
// fn.Separate(prad[1], 'set/ov0', 0);
// fn.Separate(brca[1], 'set/ov1', 0);


// -------------------------------------------------------------------------- //
// Генерация таблиц через граф
genes = {};
users = {};
var ov0 = fn.Load('set/ov0.ov.maf');
var ov1 = fn.Load('set/ov1.ov.maf');

var glist_ = {};

for (var k in ov0) {
	var line = [];
	for (var gid in genesline) {
		if (!glist_[gid]) glist_[gid] = 0;
		if (users[ov0[k]][gid]) glist_[gid]++;
		line.push(users[ov0[k]][gid] || 0);
		for (var sub in genesline[gid]) {
			var good = (users[ov0[k]][gid] || 0) * genesline[gid][sub];
			line.push(good);
			if (!glist_[sub]) glist_[sub] = 0;
			if (users[ov0[k]][gid]) glist_[gid]++;
		}
	}
}

for (var k in ov1) {
	var line = [];
	for (var gid in genesline) {
		if (!glist_[gid]) glist_[gid] = 0;
		if (users[ov1[k]][gid]) glist_[gid]++;
		line.push(users[ov1[k]][gid] || 0);
		for (var sub in genesline[gid]) {
			var good = (users[ov1[k]][gid] || 0) * genesline[gid][sub];
			line.push(good);
			if (!glist_[sub]) glist_[sub] = 0;
			if (users[ov1[k]][gid]) glist_[gid]++;
		}
	}
}

var glist = [];
for (var gid in glist_) glist.push(gid);
glist.sort(function(a,b){
	if (glist_[a] == glist_[b]) return 0;
	if (glist_[a] >  glist_[b]) return -1;
	return 1;
});


var file = ['user,' + glist.join(',') + ',type'];
for (var i in ov0) {
	var uid = ov0[i];
	if (uid.indexOf('Sample_Barcode') != -1) continue;
    var line = [uid];
    for(var i in glist) line.push(users[uid][glist[i]] || '0');
    line.push("H0");
    file.push(line.join(','));
}
for (var i in ov1) {
	var uid = ov1[i];
	if (uid.indexOf('Sample_Barcode') != -1) continue;
    var line = [uid];
    for(var i in glist) line.push(users[uid][glist[i]] || '0');
    line.push("H1");
    file.push(line.join(','));
}

console.log(line.length);
fn.Save('net/_net4k.ON.sorted.csv', file.join('\n'));
