var http = require("http");
var fs = require('fs');
var path = require("path");



// fs.mkdir('/Users/rigaraotoko/Documents/2-素材/picture/nodes/aa',function(a){})

fs.exists("/Users/rigaraotoko/Documents/2-素材/picture/nodes", function(err){
	console.log(err);
});

