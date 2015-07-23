global.fs = require('fs');
global.fn = require('./@functions.js');

global.genes = {};
global.users = {};

// Данные OV
global.ov = [
	'../../somatic/OV/Somatic_Mutations/BCM__SOLiD_DNASeq_curated/Level_2/hgsc.bcm.edu__SOLiD_curated_DNA_sequencing_level2.maf',
	'../../somatic/OV/Somatic_Mutations/WUSM__IlluminaGA_DNASeq/Level_2/genome.wustl.edu__Illumina_Genome_Analyzer_DNA_Sequencing_level2.maf',
	'../../somatic/OV/Somatic_Mutations/BI__IlluminaGA_DNASeq/Level_2/broad.mit.edu__Illumina_Genome_Analyzer_DNA_Sequencing_level2.maf' 
];

// Данные BRCA
global.brca = [
	'../../somatic/BRCA/Somatic_Mutations/BCGSC__IlluminaHiSeq_DNASeq_automated/Level_2/bcgsc.ca__IlluminaHiSeq_automated_DNA_sequencing_level2.maf',
	'../../somatic/BRCA/Somatic_Mutations/BI__IlluminaGA_DNASeq_automated/Level_2/broad.mit.edu__IlluminaGA_automated_DNA_sequencing_level2.maf',
	'../../somatic/BRCA/Somatic_Mutations/BI__IlluminaGA_DNASeq_curated/Level_2/broad.mit.edu__IlluminaGA_curated_DNA_sequencing_level2.maf',
	'../../somatic/BRCA/Somatic_Mutations/BI__IlluminaGA_DNASeq/Level_2/broad.mit.edu__Illumina_Genome_Analyzer_DNA_Sequencing_level2.maf' 
];

// Данные PRAD
global.prad = [
	'../../somatic/PRAD/Somatic_Mutations/BCM__IlluminaGA_DNASeq_automated/Level_2/hgsc.bcm.edu__IlluminaGA_automated_DNA_sequencing_level2.maf',
	'../../somatic/PRAD/Somatic_Mutations/BI__IlluminaGA_DNASeq_automated/Level_2/broad.mit.edu__IlluminaGA_automated_DNA_sequencing_level2.maf',
	'../../somatic/PRAD/Somatic_Mutations/BI__IlluminaGA_DNASeq_curated/Level_2/broad.mit.edu__IlluminaGA_curated_DNA_sequencing_level2.maf'
];
