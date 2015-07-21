fs = require('fs')

// Данные OV
ov1 = '../somatic/OV/Somatic_Mutations/BCM__SOLiD_DNASeq_curated/Level_2/hgsc.bcm.edu__SOLiD_curated_DNA_sequencing_level2.maf';
ov2 = '../somatic/OV/Somatic_Mutations/WUSM__IlluminaGA_DNASeq/Level_2/genome.wustl.edu__Illumina_Genome_Analyzer_DNA_Sequencing_level2.maf';
ov3 = '../somatic/OV/Somatic_Mutations/BI__IlluminaGA_DNASeq/Level_2/broad.mit.edu__Illumina_Genome_Analyzer_DNA_Sequencing_level2.maf';

// Данные BRCA
brca = '../somatic/BRCA/Somatic_Mutations/BCGSC__IlluminaHiSeq_DNASeq_automated/Level_2/bcgsc.ca__IlluminaHiSeq_automated_DNA_sequencing_level2.maf';
brca = '../somatic/BRCA/Somatic_Mutations/BI__IlluminaGA_DNASeq_automated/Level_2/broad.mit.edu__IlluminaGA_automated_DNA_sequencing_level2.maf';
brca = '../somatic/BRCA/Somatic_Mutations/BI__IlluminaGA_DNASeq_curated/Level_2/broad.mit.edu__IlluminaGA_curated_DNA_sequencing_level2.maf';
brca = '../somatic/BRCA/Somatic_Mutations/BI__IlluminaGA_DNASeq/Level_2/broad.mit.edu__Illumina_Genome_Analyzer_DNA_Sequencing_level2.maf';

// Данные PRAD
prad = '../somatic/PRAD/Somatic_Mutations/BCM__IlluminaGA_DNASeq_automated/Level_2/hgsc.bcm.edu__IlluminaGA_automated_DNA_sequencing_level2.maf';
prad = '../somatic/PRAD/Somatic_Mutations/BI__IlluminaGA_DNASeq_automated/Level_2/broad.mit.edu__IlluminaGA_automated_DNA_sequencing_level2.maf';
prad = '../somatic/PRAD/Somatic_Mutations/BI__IlluminaGA_DNASeq_curated/Level_2/broad.mit.edu__IlluminaGA_curated_DNA_sequencing_level2.maf';

var genes = {};
var users = {};
var maxG = 0;
var gene_pos = {};
var sort_genes = [];


function AppendData(data, prefix) {
	for (var i in data) {
		var e = data[i].split("\t");
		if (!e[15]) continue;
		var uid = (prefix || '') + e[15];
		if (!genes[e[0]] && e[0]) {
			gene_pos[e[0]] = e[4];
			genes[e[0]] = 0;
		}
		genes[e[0]]++;
		if (!users[uid]) users[uid] = {};
		users[uid][e[0]] = e;
	}
}

function Line(uid, info) {
	var line = '';
	var FColor = function(color, geneID) {
		if (!info[geneID]) return '';
		if ((info[geneID][12] + info[geneID][11] + info[geneID][10]).length > 15) return 'style="background: rgb(0,0,0)"';
		if (info[geneID][9] == 'SNP') return 'style="background: rgb(255,'+color+','+color+')"';
		return 'style="background: rgb('+color+','+color+',255)"';
	};
	for (var i in sort_genes) {
		var geneID = sort_genes[i].key;
		if (genes[geneID] <= 17) continue;
		if (genes[geneID] > maxG) maxG = genes[geneID];
		var color = 180 - genes[geneID];
		line += '<i '+FColor(color, geneID)+'></i>';
	}
	//return '<div>' + line + '<div> - ' + uid + '</div></div>';
	return '<div>' + line + '</div>';
}

function ShowUsers() {
	for (var geneID in genes){
		sort_genes.push({
			key: geneID,
			value: gene_pos[geneID]
		});
	}
	sort_genes.sort(function(a, b){
		if(gene_pos[a.key]==gene_pos[b.key]) return 0;
		else if(gene_pos[a.key]>gene_pos[b.key]) return 1;
		return -1;
	});
	
	//console.log(sort_genes);

	for (var uid in users) {
		//Line(uid, users[uid])
		console.log(Line(uid, users[uid]));
	}
}

var ovData1 = fs.readFileSync(ov1, 'utf8').split("\n");
var ovData2 = fs.readFileSync(ov2, 'utf8').split("\n");
var ovData3 = fs.readFileSync(ov3, 'utf8').split("\n");
var brcaData = fs.readFileSync(brca, 'utf8').split("\n");
var pradData = fs.readFileSync(prad, 'utf8').split("\n");

AppendData(ovData1, "OV1_");
AppendData(ovData2, "OV2_");
AppendData(ovData3, "OV3_");
AppendData(brcaData, "BR_");
AppendData(pradData, "PR_");

//console.log('<style>div { font-size:8px; height:8px; } div > i {float:left;display:block;width:6px;height:6px}</style>');
console.log('<style>div { height:4px; } div > i {float:left;display:block;width:4px;height:4px}</style>');
ShowUsers();
