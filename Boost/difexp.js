require('./@config.js');

var dirH0 = '/Volumes/Mac/Users/latur/Documents/Bio/mRNA/BRCA/RNASeqV2/UNC__IlluminaHiSeq_RNASeqV2/Level_3/';
var dirH1 = '/Volumes/Mac/Users/latur/Documents/Bio/mRNA/OV/RNASeqV2/UNC__IlluminaHiSeq_RNASeqV2/Level_3/';

//var e1 = fs.readdirSync(dirH1);

var geneslist = [];
var users = [];

function DifParse(dirname, type) {
	var dircontent = fs.readdirSync(dirname);
	for (var i in dircontent) {
		if (dircontent[i].indexOf('bt.exon_quantification.txt') == -1) continue;
		console.log('> FILE:' + dircontent[i]);
		var uid = dircontent[i].split('.')[2];
		var udata = fs.readFileSync(dirname + dircontent[i], 'utf8').split("\n");
		var userinfo = { dif : {}, type : (type || 0) };
		for (var l in udata) {
			var line = udata[l].split('\t');
			userinfo.dif[line[0]] = line[3];
			if (geneslist.indexOf(line[0]) == -1) geneslist.push(line[0]);
		}
		users.push(userinfo);
		process.stdout.write('\033[100D> ' + uid);
	}
	console.log('');
}

DifParse(dirH0, 'H0');
console.log(users);

