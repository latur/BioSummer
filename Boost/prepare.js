require('./@config.js');

console.log('> Разделение на тестовую и обучающую выборки...');

// -------------------------------------------------------------------------- //
// Разделение на тестовую и обучающую выборки
// Этот шаг можно пропустить
// fn.Separate(prad[1], 'set/ov0', 0/4.5);
// fn.Separate(brca[1], 'set/ov1', 0/4.5);


// -------------------------------------------------------------------------- //
// Загрузка списка всех пациентов и всех мутаций
var ov0 = fn.Load('set/ov0.ov.maf');
var ov1 = fn.Load('set/ov1.ov.maf');
console.log('> [ОВ_0/ОВ_1] = ' + ov0.length + '/' + ov1.length);


// -------------------------------------------------------------------------- //
// Экспорт
console.log('> Формирование features-таблицы');
var e = fn.Features(ov0, ov1);
var H0 = e[0], H1 = e[1], v = e[2];
// fn.Save('set/work.json', {'__ov0' : e[0], '__ov1' : e[1], '__genes' : e[2]});
console.log('> Данные подготовлены');


// -------------------------------------------------------------------------- //
// Самый крупный вклад

// Начальные веса
var W0 = [], W1 = [];
for (var i in ov0) W0.push( 0.5/ov0.length );
for (var i in ov1) W1.push( 0.5/ov1.length );

var dists = [];
for (var k in v) {
	// Среднее взвешанное среди ОВ_0 и ОВ_1
	var dist = Dist(H0[k], W0, H1[k], W1);
	if (dist == 0) continue;
	dists.push({val : dist, gene : genes[v[k]]});
	process.stdout.write('\033[100D> ' + k + '/' + v.length);
}
dists.sort(function(a, b){
	// if (a.gene.count == b.gene.count) return 0;
	// if (a.gene.count <  b.gene.count) return 1;
	if (a.val == b.val) return 0;
	if (a.val <  b.val) return 1;
	return -1;
});

var main = [];
for (var i = 0; i < 11000; i++) main.push(dists[i].gene.id);
// fn.Save('net/@roots2k.txt', main.join('\n'));
// var main = [];
// for (var i = 2000; i < 4000; i++) main.push(dists[i].gene.id);
// fn.Save('net/@roots4k.txt', main.join('\n'));

console.log('');

// Поиск среднего взвешанного среди ОВ
function Dist(H0, W0, H1, W1){
	var s0 = 0, s1 = 0;
	for (var k in H0) s0 += (H0[k] * W0[k] || 0);
	for (var k in H1) s1 += (H1[k] * W1[k] || 0);
	return Math.abs(s0/H0.length - s1/H1.length);
}

// -------------------------------------------------------------------------- //
// Экспорт данных для SVM

genes = {};
users = {};
var ov0 = fn.Load(prad[1]);
var ov1 = fn.Load(brca[1]);
var file = ['user,' + main.join(',') + ',type'];

for (var uid in users) {
    if(uid.indexOf("Sample_Barcode") != -1) continue ;
    var line = [uid];
    var type = (ov0.indexOf(uid) == -1 ? "prad" : "brca");
    for(var i in main) line.push(users[uid][main[i]] || '0');
    line.push(type);
    file.push(line.join(','));
}

fn.Save('net/_net4k.OFF.csv', file.join('\n'));

