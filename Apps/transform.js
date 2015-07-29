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
// Список сравниваемых типов рака
var dataset = [
	'COAD.HNSC',
	'COAD.KICH',
	'HNSC.KICH',
	'HNSC.KIRC',
	'KICH.KIRP',
	'KICH.KIRP',
	'KIRP.HNSC',
	'KIRP.COAD' 
];

for (var k in dataset) {
	// ---------------------------------------------------------------------- //
	users = {};
	genes = {};
	var fname = dataset[k];
	console.log('> Загрузка .maf файлов #' + fname);
	var H = dataset[k].split('.');
	var ov0 = fn.Load(data[H[0]][0]);
	var ov1 = fn.Load(data[H[1]][0]);

	// ---------------------------------------------------------------------- //
	console.log('> Экспорт файлов в csv');
	fn.Save('../CSV/'+fname+'.G0.csv', fn.CSV(ov0, ov1, genes));
	
	// ---------------------------------------------------------------------- //
	console.log('> Преобрзование с коэффициентами паганости');
	geneslist = {};
	for (var k in ov0) users[ov0[k]] = fn.Poorly(G, users[ov0[k]]);
	for (var k in ov1) users[ov1[k]] = fn.Poorly(G, users[ov1[k]]);
	fn.Save('../CSV/'+fname+'.G1.csv', fn.CSV(ov0, ov1, geneslist));
	
	// ---------------------------------------------------------------------- //
	console.log('> Повторное преобрзование с коэффициентами паганости');
	geneslist = {};
	for (var k in ov0) users[ov0[k]] = fn.Poorly(G, users[ov0[k]]);
	for (var k in ov1) users[ov1[k]] = fn.Poorly(G, users[ov1[k]]);
	fn.Save('../CSV/'+fname+'.G2.csv', fn.CSV(ov0, ov1, geneslist));
}
