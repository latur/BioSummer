exports.Save = function(filename, data) {
	var txt = (typeof(data) == 'string') ? data : JSON.stringify(data);
	fs.writeFileSync(filename, txt);
	console.log('> Сохранено: ' + filename);
};

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
	console.log('> Чтение файла: ' + file);
	var userslist = [];
	var data = fs.readFileSync(file, 'utf8').split("\n");
	for (var i in data) {
		var e = data[i].split("\t");
		if (!e[15]) continue;
		var uid = e[15];
		if (!genes[e[1]] && e[1]) {
			genes[e[1]] = {
				id    : e[1],
				ids   : e[0],
				count : 0,
				start : e[5],
				end   : e[6],
				chrom : e[4]
			};
		}
		genes[e[1]].count++;
		if (!users[uid]) users[uid] = {};
		if (!users[uid][e[1]]) users[uid][e[1]] = 0;
		users[uid][e[1]] += exports.Value(e)/(level || 1);
		if (userslist.indexOf(uid) == -1) userslist.push(uid);
	}
	return userslist;
};

// Распространение коэффициента паганости с помощью графа связей генов
exports.Poorly = function(G, user) {
	var Sum = function(list) {
		var s = 0;
		for (var i in list) s += Number(list[i]);
		return s;
	};

	var add = {};
	for (var gid in user) {
		geneslist[gid] = true;
		if (G[gid]) {
			var connected = G[gid];
			for (var to in connected) {
				if (!add[to]) add[to] = 0;
				add[to] += user[gid] * Sum(connected[to])/10;
				geneslist[to] = true;
			}
		}
	}

	for (var gid in add) {
		if (!user[gid]) user[gid] = 0;
		user[gid] += add[gid];
	}

	return user;
};

// Сохранение с csv
exports.CSV = function(ov0, ov1, geneslist){
	var glist = [];
	for (var i in geneslist) glist.push(i);
	var file = ['user,' + glist.join(',') + ',type'];
	for (var i in ov0) {
		var uid = ov0[i];
		if (uid.indexOf('Sample_Barcode') != -1) continue;
	    var line = [uid];
	    for(var g in glist) line.push(users[uid][glist[g]] || '0');
	    line.push("H0");
	    file.push(line.join(','));
	}
	for (var i in ov1) {
		var uid = ov1[i];
		if (uid.indexOf('Sample_Barcode') != -1) continue;
	    var line = [uid];
	    for(var g in glist) line.push(users[uid][glist[g]] || '0');
	    line.push("H1");
	    file.push(line.join(','));
	}
	return file.join('\n');
};
