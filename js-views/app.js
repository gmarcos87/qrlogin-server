var io = require("socket.io-client");
var socket = io.connect();

//UpdateDom
var changeImg = function(domElement, data){
 $('#qrcode').qrcode(data)
}
var changeText = function(domElement, data){
  domElement.innerHTML = data;
}

//Dom elements
var qrContainer = document.getElementById('qr')
var textContainer = document.getElementById('qr-value')

//Socket connection
socket.on('token', function (data) {
  console.log(data);
  changeImg(qrContainer,data.token);
  changeText(textContainer,data.token);
});

socket.on('login',function(data){
  firebase.auth().signInWithCustomToken(data.token)
  .then(function(user){
    console.log('login!!!',user)
  })
  .catch(function(error) {
    console.log(error)
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode === 'auth/invalid-custom-token') {
      alert('The token you provided is not valid.');
      socket.emit('error',Object.assign({error:'The token you provided is not valid.'},data));
    } else {
      socket.emit('error',Object.assign({error:error},data));
    }
  });
})

//Firebase config and connection
var config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  storageBucket: "",
  messagingSenderId: ""
};
firebase.initializeApp(config);
