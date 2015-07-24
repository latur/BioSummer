exports.Shuffle = function(o) {
	for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

exports.Save = function(filename, data) {
	var txt = (typeof(data) == 'string') ? data : JSON.stringify(data);
	fs.writeFileSync(filename, txt);
	console.log('> Saved: ' + filename);
};

// Разделение на обучающую и тестовую выборку
exports.Separate = function(source, name, part) {
	//var part = part || 1/5;
	var data = fs.readFileSync(source, 'utf8').split("\n");
	exports.Shuffle(data);

	var ni = Math.round(data.length * part);
	var ii = data.length - ni;  // Размер обучающаей
	var OV = data.slice(ni);    // Обучающая
	var TV = data.slice(0, ni); // Проверочная
	
	exports.Save(name + '.tv.maf', TV.join('\n'));
	exports.Save(name + '.ov.maf', OV.join('\n'));
}

// Метрика мутации
exports.Value = function(e) {
	if (!e[8]) return 0;
	if (e[8] == 'Missense_Mutation') return 60;
	if (e[8] == 'Frame_Shift_Ins') return 150;
	if (e[8] == 'Frame_Shift_Del') return 170;
	if (e[8] == 'Silent') return 10;
	if (e[8] == 'In_Frame_Ins') return 20;
	return 30;
};

// Загрузка генов,пациентов,преобразование метрикой
exports.Load = function(file, level) {
	console.log('> Загрузка обучающей выборки: ' + file);
	var userslist = [];
	var data = fs.readFileSync(file, 'utf8').split("\n");
	for (var i in data) {
		var e = data[i].split("\t");
		if (!e[15]) continue;
		var uid = e[15];
		if (!genes[e[0]] && e[0]) {
			genes[e[0]] = {
				id    : e[0],
				count : 0,
				start : e[5],
				end   : e[6],
				chrom : e[4]
			};
		}
		genes[e[0]].count++;
		if (!users[uid]) users[uid] = {};
		if (!users[uid][e[0]]) users[uid][e[0]] = 0;
		users[uid][e[0]] += exports.Value(e)/(level || 1);
		if (userslist.indexOf(uid) == -1) userslist.push(uid);
	}
	return userslist;
};

// Фрмирование векторов - Features
exports.Features = function(ov0, ov1) {
	// Сортировка генов:
	var sgenes = [];
	for (var geneID in genes) if (genes[geneID].count > 0) sgenes.push(geneID);

	sgenes.sort(function(a, b){
		if(genes[a].chrom == genes[b].chrom) {
			if(genes[a].start == genes[b].start) return 0;
			if(genes[a].start >  genes[b].start) return 1;
			return -1;
		}
		if(genes[a].chrom >  genes[b].chrom) return 1;
		return -1;
	});

	var ovl0 = [], ovl1 = [];

	for (var i in sgenes) {
		var fcontent = [];
		for (var e in ov0) fcontent.push(users[ov0[e]][sgenes[i]] || 0); 
		ovl0.push(fcontent);
		var fcontent = [];
		for (var e in ov1) fcontent.push(users[ov1[e]][sgenes[i]] || 0); 
		ovl1.push(fcontent);
	}

	return [ovl0, ovl1, sgenes];
};
