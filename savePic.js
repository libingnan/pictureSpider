var http = require("http");
var fs = require('fs');
var path = require("path");
var cheerio = require('/usr/local/lib/node_modules/cheerio');
var request = require('request');

// fs.mkdir('/Users/rigaraotoko/Documents/2-素材/picture/nodes/aa',function(a){})

let url = "http://www.mzitu.com/";


let basePath ="/Users/rigaraotoko/Documents/2-素材/picture/node/";
//1。 根据首页 将   链接拿到



var maxPage = 0;
// http.get("http://www.mzitu.com/",(res)=>{
// 		getMaxPageNum(res);
// });


//获取最大页数
request(url, function (error, response, body) {
  if (error || response.statusCode != 200) {
    	console.log("请求失败");
  }

  var  $ = cheerio.load(body);
  //获取最大页数
  let maxPage = getMaxPageNum($);
  
  //获取每页的图片链接
  // getUrlInPage(1);
  getUrlInPage(1);
  for(var i = 1 ;i<maxPage+1;i++){
  	// console.log(i);
	// getUrlInPage(i);
  }
 

 
});

//获取最大页数方法
var getMaxPageNum = function($){
	var x = $("a.page-numbers");
	x.each(function(i){
		var href = $(this).attr("href");
		var array=href.split("/");
		var pageNum = parseInt(array[4])
		if(pageNum>maxPage) {
			maxPage = pageNum;
		}	
	});
	return maxPage
}


var getUrlInPage = function(i){
	var urlTemp = url+"page/"+i;
	// console.log(urlTemp);
	request(urlTemp, function (error, response, body) {
		// console.log(body);
		var  $ = cheerio.load(body);
		var li= $("#pins").find("li");
		li.each(function(i){
			var imgUrl = $(this).find('a').attr('href');
			// console.log(imgUrl);
			getImgeUrl(imgUrl);
		});

	});
} 

//获取某标题的url

var getImgeUrl = function(imgUrl){
	request(imgUrl, function (error, response, body) {
		var $ = cheerio.load(body);
		//获取图片数量
		var count = getImageCount($);
		//获取图片url
		
		// console.log(title);
		var url = $(".main-image ").find("img").attr("src");


		// console.log(imgUrl);
		// console.log(url);
		if(!url || !count){
			return;
		}
		//获取图片请求地址
		var index = url.indexOf(".jpg");
		var indexLast = url.lastIndexOf("/");
		let frountUrl = url.substring(0,index - 2);
		let name = url.substring(indexLast+1,index - 2);

		let backUrl = ".jpg";
		var title = $("h2").text();

		//循环请求
		var endCount = parseInt(count)+1;
		for(var i=1 ;i<endCount;i++){
			let requestUrl ;
			if(i<10){
				requestUrl = frountUrl+"0"+i+backUrl;
			}else{
				requestUrl = frountUrl+i+backUrl;
			}
			let localFsPath = basePath+title+"/"+name+i+backUrl;
			// name = name+i+backUrl;
			// console.log(name+"\n"+requestUrl);
			// exists(basePath+title, callback);
			fs.mkdir(basePath+title,(success)=>{
				if(success){
					request(requestUrl).pipe(fs.createWriteStream(localFsPath));
				}
			});
			
		}
	});
}
//获取图片数量
var getImageCount = function($){
	let hrefs= $($(".pagenavi").find("a")[4]).attr("href");
	// console.log(hrefs);
	if(hrefs){
		let count = hrefs.split('/')[4];
		// console.log(count);
		return count
	}
	return 0
}

