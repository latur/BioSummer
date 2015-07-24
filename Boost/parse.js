require('./@config.js');

// -------------------------------------------------------------------------- //
// Разделение на тестовую и обучающую выборки
// Этот шаг можно пропустить
fn.Separate(prad[1], 'set/ov0', 0);
fn.Separate(brca[1], 'set/ov1', 0);

// -------------------------------------------------------------------------- //
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
			if (connected[cc] != '' && !genesline[connected[cc]]) {
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
			if (connected[cc] != '' && !genesline[connected[cc]]) {
				var ccid = connected[cc];
				if (!genesline[gid][ccid]) genesline[gid][ccid] = score;
			}
		}
	}
}

// -------------------------------------------------------------------------- //
// Генерация таблиц через граф
genes = {};
users = {};
var ov0 = fn.Load('set/ov0.ov.maf');
var ov1 = fn.Load('set/ov1.ov.maf');

for (var k in ov0) {
	var glist = [];
	var line = [];
	for (var gid in genesline) {
		glist.push(gid);
		line.push(users[ov0[k]][gid] || 0);
		for (var sub in genesline[gid]) {
			var good = (users[ov0[k]][gid] || 0) * genesline[gid][sub];
			line.push(good);
			glist.push(sub);
		}
	}
}

for (var k in ov1) {
	var line = [];
	for (var gid in genesline) {
		line.push(users[ov1[k]][gid] || 0);
		for (var sub in genesline[gid]) {
			var good = (users[ov1[k]][gid] || 0) * genesline[gid][sub];
			line.push(good);
		}
	}
}


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
fn.Save('net/_net4k.ON.csv', file.join('\n'));


