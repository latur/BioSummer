fs = require('fs')

// Данные OV
var ov = [
	'../somatic/OV/Somatic_Mutations/BCM__SOLiD_DNASeq_curated/Level_2/hgsc.bcm.edu__SOLiD_curated_DNA_sequencing_level2.maf',
	'../somatic/OV/Somatic_Mutations/WUSM__IlluminaGA_DNASeq/Level_2/genome.wustl.edu__Illumina_Genome_Analyzer_DNA_Sequencing_level2.maf',
	'../somatic/OV/Somatic_Mutations/BI__IlluminaGA_DNASeq/Level_2/broad.mit.edu__Illumina_Genome_Analyzer_DNA_Sequencing_level2.maf' 
];

// Данные BRCA
var brca = [
	'../somatic/BRCA/Somatic_Mutations/BCGSC__IlluminaHiSeq_DNASeq_automated/Level_2/bcgsc.ca__IlluminaHiSeq_automated_DNA_sequencing_level2.maf',
	'../somatic/BRCA/Somatic_Mutations/BI__IlluminaGA_DNASeq_automated/Level_2/broad.mit.edu__IlluminaGA_automated_DNA_sequencing_level2.maf',
	'../somatic/BRCA/Somatic_Mutations/BI__IlluminaGA_DNASeq_curated/Level_2/broad.mit.edu__IlluminaGA_curated_DNA_sequencing_level2.maf',
	'../somatic/BRCA/Somatic_Mutations/BI__IlluminaGA_DNASeq/Level_2/broad.mit.edu__Illumina_Genome_Analyzer_DNA_Sequencing_level2.maf' 
];

// Данные PRAD
var prad = [
	'../somatic/PRAD/Somatic_Mutations/BCM__IlluminaGA_DNASeq_automated/Level_2/hgsc.bcm.edu__IlluminaGA_automated_DNA_sequencing_level2.maf',
	'../somatic/PRAD/Somatic_Mutations/BI__IlluminaGA_DNASeq_automated/Level_2/broad.mit.edu__IlluminaGA_automated_DNA_sequencing_level2.maf',
	'../somatic/PRAD/Somatic_Mutations/BI__IlluminaGA_DNASeq_curated/Level_2/broad.mit.edu__IlluminaGA_curated_DNA_sequencing_level2.maf'
];

var mlevel = 22;

var genes = {};
var users = {};
var genesCount = 0;
var usersCount = {};

function AppendData(data, prefix) {
	for (var i in data) {
		var e = data[i].split("\t");
		if (!e[15]) continue;
		var uid = (prefix || '') + e[15];
		if (!genes[e[0]] && e[0]) {
			genesCount++;
			genes[e[0]] = {
				count : 0,
				start : e[5],
				end   : e[6],
				chrom : e[4]
			};
		}
		genes[e[0]].count++;
		if (!usersCount[prefix]) {
			usersCount[prefix] = 0;
		}
		if (!users[uid]) {
			usersCount[prefix]++;
			users[uid] = {};
		}
		users[uid][e[0]] = e;
	}
}

//AppendData(fs.readFileSync(ov[0], 'utf8').split("\n"), "OV0_");
//AppendData(fs.readFileSync(ov[1], 'utf8').split("\n"), "OV1_");
AppendData(fs.readFileSync(ov[2], 'utf8').split("\n"), "OV2_");
//AppendData(fs.readFileSync(brca[0], 'utf8').split("\n"), "BRCA0_");
//AppendData(fs.readFileSync(brca[1], 'utf8').split("\n"), "BRCA1_");
AppendData(fs.readFileSync(brca[2], 'utf8').split("\n"), "BRCA2_");
AppendData(fs.readFileSync(brca[3], 'utf8').split("\n"), "BRCA3_");
AppendData(fs.readFileSync(prad[0], 'utf8').split("\n"), "PRAD0_");
//AppendData(fs.readFileSync(prad[1], 'utf8').split("\n"), "PRAD1_");
AppendData(fs.readFileSync(prad[2], 'utf8').split("\n"), "PRAD2_");

// Распределение количества мутаций на ген:
var hist = {};
for (var geneID in genes) {
	if (!hist[genes[geneID].count]) hist[genes[geneID].count] = 0;
	hist[genes[geneID].count] ++;
}

// Сортировка генов:
var sgenes = [];
for (var geneID in genes) {
	if (genes[geneID].count > mlevel) sgenes.push(geneID);
}

sgenes.sort(function(a, b){
	if(genes[a].chrom == genes[b].chrom) {
		if(genes[a].start == genes[b].start) return 0;
		if(genes[a].start >  genes[b].start) return 1;
		return -1;
	}
	if(genes[a].chrom >  genes[b].chrom) return 1;
	return -1;
});

// Преобразование в HTML
console.log('<pre>');
console.log('Users: ' + JSON.stringify(usersCount));
console.log('Genes: ' + sgenes.length + '/' + genesCount);
console.log('Mutations level: ' + mlevel);
console.log('</pre>');

// Отрисовка распределения:
var histHtml = '';
var maxH = 200;
for (var cnt in hist) {
	var style = 'margin-top:' + (maxH - hist[cnt] * maxH/hist['1'] - 7)+'px;';
	if (cnt == mlevel) style += 'background-color: #F00';
	histHtml += '<div title="'+hist[cnt]+'" style="'+style+'">'+cnt+'</div>';
}
console.log('<div class="hist" style="height:'+maxH+'px">' + histHtml + '</div>');

var W = (sgenes.length) * 4 + 23 * 5;

for (var uid in users) {
	var line = '';
	var info = users[uid];
	
	if (uid.indexOf('Sample_Barcode') != -1) {
		console.log('<b>' + line + '</b>');
		continue;
	}
	
	var Point = function(color, geneID) {
		if (!info[geneID]) return '';
		if (info[geneID][9] == 'SNP') return ' class="S" style="background: rgb(255,'+color+','+color+')"';
		if (info[geneID][9] == 'DEL') return ' class="D" ';
		if (info[geneID][9] == 'INS') return ' class="I" ';
		return ' class="B" ';
	};
	
	var chrom = 1;
	for (var i in sgenes) {
		var geneID = sgenes[i];
		var color = 180 - genes[geneID].count;
		if (genes[geneID].chrom != chrom) {
			chrom = genes[geneID].chrom;
			line += '<i class="sep"></i>';
		}
		line += '<i'+Point(color, geneID)+'></i>';
	}

	console.log('<div style="width:' + W + 'px">' + line + '</div>');
}

// (cat visual.css && node getData.js) > visual.4.html
