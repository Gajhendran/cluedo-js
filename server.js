var express = require('express');

var app = express();
app.use(express.static('client'))

//app.get('/', function(req, res) {
//    res.send('Hello world');
//});

var server = app.listen(process.env.PORT, function(){
    console.log('Started serving')
})
