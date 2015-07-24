require('./@config.js');

console.log('> Разделение на тестовую и обучающую выборки...');

// -------------------------------------------------------------------------- //
// Разделение на тестовую и обучающую выборки
// Этот шаг можно пропустить
// fn.Separate(prad[1], 'set/ov0', 0/4);
// fn.Separate(brca[1], 'set/ov1', 0/4);


// -------------------------------------------------------------------------- //
// Загрузка списка всех пациентов и всех мутаций
genes = {};
users = {};
fn.Load('set/ov0.ov.maf');
fn.Load('set/ov1.ov.maf');
var glist = [];
for (var gid in genes) glist.push(gid);
glist.sort(function(a,b){
	if (genes[a].count == genes[b].count) return 0;
	if (genes[a].count >  genes[b].count) return -1;
	return 1;
});
var data = [];
for (var i = 0; i < 500; i++) {
	data.push([genes[glist[i]].id, genes[glist[i]].count]);
	console.log(genes[glist[i]].id);
}

fn.Save('net/roots.json', data);
