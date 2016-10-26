var path = require("path"),
    express = require('express'),
    app = express(),
    dev = false;

process.argv.forEach(function (val, index, array) {
  if(val == "--development")
  {
    dev = true;
  }
});

if(dev)
{
    var webpack = require('webpack'),
        WebpackDevServer = require('webpack-dev-server'),
        config = require('./webpack.config');

    var server = new WebpackDevServer(webpack(config), {
        publicPath: config.output.publicPath,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        }
    });

    server.use('/', function(req, res) {
        res.sendFile(path.join(__dirname+'/index.html'));
    });

    server.listen(3003, 'localhost', function (err, result) {
        if (err) {
          console.log(err);
        }

        console.log('Running at http://localhost:3003');
    });    
}
else
{
    app.use('/', express.static('dist'));
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname + '/index.html'));
    });

    app.listen(3003, function () {
      console.log('Running at http://localhost:3003');
    });   
}