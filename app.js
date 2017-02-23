const express = require('express')
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const login = require('./routes/login');

const crypto = require('crypto');
const admin = require('./firebase-admin')
let socketConections = [];
const fs = require('fs');
const https = require('https');

let server = https.createServer({
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt')
}, app)

const io = require('socket.io')(server);

const port = process.env.PORT || 3000;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res) {
  res.render('login-view');
});

app.get('/app', function(req, res) {
  res.render('app-view');
});

app.post('/login', function(req, res, next) {
  let clientToken = req.body.token;
  let clientHash = req.body.hash;

  admin.auth().verifyIdToken(clientToken)
    .then(function(decodedToken) {
      return Promise.all([decodedToken, admin.auth().createCustomToken(decodedToken.user_id)]);
    })
    .then(function(customToken) {
      console.log(customToken)
      socketConections[clientHash].emit('login',{token:customToken[1]})
      res.send({
        status:'ok',
        userAgent: socketConections[clientHash].request.headers['user-agent'],
        userIp: socketConections[clientHash].request.connection.remoteAddress
      })
    })
    .catch(function(err){
      res.send(err)
    });
})

server.listen(port, function(){
  console.log("Express server listening on port " + port);
});
//Socket and sessions

io.on('connection', function (socket) {
  var id = crypto.randomBytes(20).toString('hex');
  socketConections[id] = socket;
  console.log('Got connect!',id,socketConections.length);
  console.log({
    status:'ok',
    userAgent: socket.request.headers['user-agent'],
    userIp: socket.request.connection.remoteAddress
  })
  socket.emit('token',{token:id});
  socket.on('disconnect', function() {
      var i = socketConections.indexOf(id);
      socketConections.splice(i, 1);
      console.log('Got disconnect!',id,socketConections.length);
   });
});

module.exports = app;
