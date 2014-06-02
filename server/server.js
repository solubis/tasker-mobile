var restify     =   require('restify');
var mongojs     =   require('mongojs');
var morgan      =   require('morgan');
var db          =   mongojs('bucketlistapp', ['appUsers','bucketLists']);
var server      =   restify.createServer();

erver.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(morgan('dev')); // LOGGER

// CORS
server.use(function(req, res, next) {
  res.groupHeader('Access-Control-Allow-Origin', "*");
  res.groupHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.groupHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

server.listen(process.env.PORT || 9804, function () {
  console.log("Server started @ ",process.env.PORT || 9804);
});