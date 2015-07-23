fs = require('fs')

// Данные OV
var ov = [
//    './data/hgsc.bcm.edu__SOLiD_curated_DNA_sequencing_level2.maf',
//    './data/genome.wustl.edu__Illumina_Genome_Analyzer_DNA_Sequencing_level2.maf',
    './data/ov.maf'
];

// Данные BRCA
var brca = [,
    './data/BRCA',
    './data/BRCA',
    './data/BRCA'
];

// Данные PRAD
var prad = [
    './data/PRAD',
    './data/PRAD',
    './data/PRAD'
];

var genes = {};
var users = {};

function AppendData(data, prefix, type) {
    for (var i in data) {
        var e = data[i].split("\t");
        if (!e[15]) continue;
        var uid = (prefix || '') + e[15];
        if (!genes[e[0]] && e[0]) {
            genes[e[0]] = {
                count : 0,
                start : e[5],
                end   : e[6],
                chrom : e[4]
            };
        }
        /*
        if(e[0]=='Unknown'){
            console.log('asd');
        }*/
        genes[e[0]].count++;
        if (!users[uid]) {
            users[uid] = {
                type: type
            };
        }
        if(!users[uid][e[0]]) {
            users[uid][e[0]]=0;
        }
        ++users[uid][e[0]];
    }
}

//AppendData(fs.readFileSync(ov[0], 'utf8').split("\n"), "OV0_");
//AppendData(fs.readFileSync(ov[1], 'utf8').split("\n"), "OV1_");
//AppendData(fs.readFileSync(ov[2], 'utf8').split("\n"), "OV2_");
//AppendData(fs.readFileSync(brca[0], 'utf8').split("\n"), "BRCA0_");
//AppendData(fs.readFileSync(brca[1], 'utf8').split("\n"), "BRCA1_");
AppendData(fs.readFileSync(brca[2], 'utf8').split("\n"), "BRCA2_", "BRCA");
//AppendData(fs.readFileSync(brca[3], 'utf8').split("\n"), "BRCA3_");
//AppendData(fs.readFileSync(prad[0], 'utf8').split("\n"), "PRAD0_");
AppendData(fs.readFileSync(prad[1], 'utf8').split("\n"), "PRAD1_", "PRAD");
//AppendData(fs.readFileSync(prad[2], 'utf8').split("\n"), "PRAD2_");

var sgenes = [], i=0;
for (var geneID in genes) {
    ++i;
    if (genes[geneID].count > 6) sgenes.push(geneID);
}
console.log("man"+","+sgenes.join(",")+",type");


for (var uid in users) {
    if(uid.indexOf("Sample_Barcode") != -1) continue ;
    var s = "";
    for(var i in sgenes){
        geneID = sgenes[i];
        if(users[uid][geneID]){
            s+=users[uid][geneID]+",";
        } else {
            s+="0,"
        }
    }
    console.log(uid+","+s+users[uid].type)
}