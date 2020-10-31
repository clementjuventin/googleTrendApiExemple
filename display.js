var http = require("http");
fs = require('fs');

var config={
    start:'2020-10-20',
    end:'2020-10-30'
}

function start() {
    fs.readFile("./display/index.html", 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        else{
            data = buildPage(data, config);
            http.createServer(function(request, response){
                console.log("Requête reçue");
        
                response.writeHead(200, {"Content-Type": "text/html"});
                
                response.write(data);
                response.end();
            }).listen(8888);
            console.log("Server online");
        }
    });    
}
start();



function buildPage(data, config){
    targetDate = new Date(Date.parse(config.start));
    endDate = new Date(Date.parse(config.end));
    var trends;
    var addText="";

    while(targetDate<=endDate){
        trends = JSON.parse(fs.readFileSync("./results/"+(targetDate.getYear()+1900)+(targetDate.getMonth()+1)+targetDate.getDate()+".json", {encoding:'utf8', flag:'r'}));
        
        addText+='\n<div class="content">\n\t<h3>'+targetDate+'</h3>\n';
        trends.forEach(element => {
            addText+=trendsToString(element);
        });
        addText+='\n</div>\n';
        targetDate.setDate(targetDate.getDate()+1);
    }
    var i = data.indexOf('<h1>Results</h1>')+16;
    data = data.slice(0, i)+addText+data.slice(i);
    return data;
}
function trendsToString(element){
    return '<a href="'+element.newsUrl+'"><image src="'+element.imageUrl+'"></image></a>\n';
}
