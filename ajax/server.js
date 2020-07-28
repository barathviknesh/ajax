// var http = require('http');
var fs = require('fs');
http.createServer(function (req, res) {
    fs.readFile('dataset.json', function (err, data) {
        res.writeHead(200, { 'content-Type': 'json' });
        res.write(data);
        return res.end();
    });

}).listen(8080);