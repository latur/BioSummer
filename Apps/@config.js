global.fs = require('fs');
global.fn = require('./@functions.js');

global.genes = {};
global.users = {};
global.geneslist = {};
global.net = '../Data/HumanNet.v1.join.txt';

// Ссылки на данные соматических мутаций
global.data = {
	'COAD' : [
		'../Data/COAD/hgsc.bcm.edu__ABI_SOLiD_DNA_Sequencing_level2.maf',
		'../Data/COAD/hgsc.bcm.edu__Illumina_Genome_Analyzer_DNA_Sequencing_level2.maf'
	],
	'HNSC' : [
		'../Data/HNSC/bcgsc.ca__IlluminaHiSeq_automated_DNA_sequencing_level2.maf',
		'../Data/HNSC/broad.mit.edu__Illumina_Genome_Analyzer_DNA_Sequencing_level2.maf',
		'../Data/HNSC/broad.mit.edu__IlluminaGA_automated_DNA_sequencing_level2.maf',
		'../Data/HNSC/broad.mit.edu__IlluminaGA_curated_DNA_sequencing_level2.maf'
	],
	'KICH' : [
		'../Data/KICH/bcgsc.ca__IlluminaHiSeq_automated_DNA_sequencing_level2.maf',
		'../Data/KICH/broad.mit.edu__Illumina_Genome_Analyzer_DNA_Sequencing_level2.maf',
		'../Data/KICH/hgsc.bcm.edu__Illumina_Genome_Analyzer_DNA_Sequencing_level2.maf',
		'../Data/KICH/hgsc.bcm.edu__Mixed_curated_DNA_sequencing_level2.maf'
	],
	'KIRC' : [
		'../Data/KIRC/broad.mit.edu__IlluminaGA_automated_DNA_sequencing_level2.maf',
		'../Data/KIRC/hgsc.bcm.edu__Mixed_DNA_Sequencing_level2.maf'
	],
	'KIRP' : [
		'../Data/KIRP/broad.mit.edu__Illumina_Genome_Analyzer_DNA_Sequencing_level2.maf',
		'../Data/KIRP/broad.mit.edu__IlluminaGA_automated_DNA_sequencing_level2.maf',
		'../Data/KIRP/broad.mit.edu__IlluminaGA_curated_DNA_sequencing_level2.maf',
		'../Data/KIRP/hgsc.bcm.edu__IlluminaGA_curated_DNA_sequencing_level2.maf',
		'../Data/KIRP/hgsc.bcm.edu__Mixed_curated_DNA_sequencing_level2.maf',
		'../Data/KIRP/ucsc.edu__IlluminaGA_automated_DNA_sequencing_level2.maf'
	]
};

