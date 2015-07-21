fs = require('fs')

// Данные OV
ov = '../somatic/OV/Somatic_Mutations/BCM__SOLiD_DNASeq_curated/Level_2/hgsc.bcm.edu__SOLiD_curated_DNA_sequencing_level2.maf';
ov = '../somatic/OV/Somatic_Mutations/WUSM__IlluminaGA_DNASeq/Level_2/genome.wustl.edu__Illumina_Genome_Analyzer_DNA_Sequencing_level2.maf';
ov = '../somatic/OV/Somatic_Mutations/BI__IlluminaGA_DNASeq/Level_2/broad.mit.edu__Illumina_Genome_Analyzer_DNA_Sequencing_level2.maf';

// Данные BRCA
brca = '../somatic/BRCA/Somatic_Mutations/BCGSC__IlluminaHiSeq_DNASeq_automated/Level_2/bcgsc.ca__IlluminaHiSeq_automated_DNA_sequencing_level2.maf';
brca = '../somatic/BRCA/Somatic_Mutations/BI__IlluminaGA_DNASeq_automated/Level_2/broad.mit.edu__IlluminaGA_automated_DNA_sequencing_level2.maf';
brca = '../somatic/BRCA/Somatic_Mutations/BI__IlluminaGA_DNASeq_curated/Level_2/broad.mit.edu__IlluminaGA_curated_DNA_sequencing_level2.maf';
brca = '../somatic/BRCA/Somatic_Mutations/BI__IlluminaGA_DNASeq/Level_2/broad.mit.edu__Illumina_Genome_Analyzer_DNA_Sequencing_level2.maf';

var genes = {};
var users = {};
var lines = 0;

function AppendData(data, prefix) {
	for (var i in data) {
		var e = data[i].split("\t");
		if (!e[15]) continue;
		var uid = (prefix || '') + e[15];
		if (!genes[e[0]] && e[0]) genes[e[0]] = 0;
		genes[e[0]]++;
		if (!users[uid]) users[uid] = {};
		users[uid][e[0]] = e;
	}
}

function Line(uid, info) {
	var line = '';
	for (var geneID in genes) {
		if(genes[geneID] <= 5) continue;
		line += (info[geneID] ? '<div class="s s1"></div>' : '<div class="s s0"></div>');
		lines++;
	}
	return '<div>' + line + '<div>' + uid + '</div></div>';
}

function ShowUsers() {
	for (var uid in users) {
		//Line(uid, users[uid]);
		console.log(Line(uid, users[uid]));
	}
}

var ovData = fs.readFileSync(ov, 'utf8').split("\n");
var brcaData = fs.readFileSync(brca, 'utf8').split("\n");

AppendData(ovData, "OV_");
AppendData(brcaData, "BR_");
console.log('<style>div { font-size:8px; height:8px; } div > div {float:left;} .s { float: left; width:5px;height:5px } .s1 { background:#f00; } .s0 { background:#eee; }</style>');
ShowUsers();
//

//var c = 0;
//for (var i in genes) if(genes[i] > 5) c++;


//console.log(ovData[0].split("\t"));


