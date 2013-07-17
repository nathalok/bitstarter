#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:
+ cheerio
+ commander.js

*/
var sys = require('util');
var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var rest = require('restler');

var assertFileExists = function(infile){
    var instr = infile.toString();
    if(!fs.existsSync(instr)){
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1);
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile){
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};


 var checkHtmlFile = function(myURL, checksfile) {
     var out = {};
     rest.get(myURL).on('complete', function(result){ 
	fs.writeFileSync(HTMLFILE_DEFAULT, result);

	$ = cheerioHtmlFile(HTMLFILE_DEFAULT);
	var checks = loadChecks(checksfile).sort();

	for(var ii in checks) {
	    
	    var present = $(checks[ii]).length > 0;
	    out[checks[ii]] = present;
	    
	}
//	 console.log("Raw out is ", out);
	 console.log(JSON.stringify( out, null, 4));

    });
};


 var _checkHtmlFile = function(myURL, htmlfile, checksfile) {
    console.log("inside checkHtmlFile");
    getHtmlFile(myURL, htmlfile);

    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};

    for(var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};
var clone = function(fn) {
// Workaround for commander.js issue.
// http://stackoverflow.com/a/6772648
    return fn.bind({});
}

if(require.main == module) {
    program
	.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
//	.option('-f, --file <html_file>', 'Path to index.html')//, clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('-u, --url <url_file>', 'bitstarter url for index.html')//, clone(assertFileExists), HTMLFILE_DEFAULT)
	.parse(process.argv);

    checkHtmlFile(program.url, program.checks);

    //console.log("json sring is.. ", checkJson);
    //var outJson = JSON.stringify(checkJson, null, 4);
    //console.log(outJson);
}else{
    exports.checkHtmlFile = checkHtmlFile;
}


