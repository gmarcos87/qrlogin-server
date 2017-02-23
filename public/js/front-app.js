var socket = io.connect();

var changeImg = function(data){
  $('#qrcode').empty()
 $('#qrcode').qrcode(data)
}
var changeText = function(data){
  $('#qr-value').text(data)
}

var hiddeQr = function(){
  $('#qrcode').fadeOut()
}

jQuery(document).ready(function($){
  //Socket connection
  socket.on('token', function (data) {
    console.log(data);
    changeImg(data.token);
    changeText(data.token);
  });

  socket.on('login',function(data){
    console.log('Token de login recibido',data)
    firebase.auth().signInWithCustomToken(data.token)
    .then(function(user){
      console.log('Login correcto!!!',user)
      hiddeQr();
      changeText('Hola '+user.email);
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
