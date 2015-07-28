require('./@config.js');

// -------------------------------------------------------------------------- //
console.log('> Загрузка сети генных взаимодействий');
var GF = fs.readFileSync(net, 'utf8').split("\n"), G = {};
for (var i in GF) {
	var e = GF[i].replace(/NA/g,'').split("\t");
	if (!G[e[0]]) G[e[0]] = {};
	G[e[0]][e[1]] = e.slice(2);
}

// -------------------------------------------------------------------------- //
console.log('> Загрузка .maf файлов');
var ov0 = fn.Load(data.KICH[1]);
var ov1 = fn.Load(data.HNSC[1]);

// -------------------------------------------------------------------------- //
console.log('> Экспорт файлов в csv');
fn.Save('../CSV/KICH.HNSC.f1.csv', fn.CSV(ov0, ov1, genes));

// -------------------------------------------------------------------------- //
console.log('> Преобрзование с коэффициентами паганости');
for (var k in ov0) users[ov0[k]] = fn.Poorly(G, users[ov0[k]]);
for (var k in ov1) users[ov1[k]] = fn.Poorly(G, users[ov1[k]]);
fn.Save('../CSV/KICH.HNSC.f2.csv', fn.CSV(ov0, ov1, geneslist));

