var webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    config = require('./webpack.config'),
    path = require("path");

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
