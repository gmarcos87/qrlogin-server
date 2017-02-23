function post(url,data,cb){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
          var json = JSON.parse(xhr.responseText);
          cb(json);
      }
  }
  var data = JSON.stringify(data);
  xhr.send(data);
}




function onSuccess(data) {
  console.log(data)
   document.getElementById('video').setAttribute("style", "border: 3px solid #52e250");
   firebase.auth().signInWithEmailAndPassword('your@account.com','pa$$word').catch(function(error) {
     // Handle Errors here.
     console.log(error)
     var errorCode = error.code;
     var errorMessage = error.message;
     // ...
   }).then(function(user){
     firebase.auth().currentUser.getToken(true).then(function(idToken) {
       post('/login',{token:idToken,hash:data},function(x){alert(JSON.stringify(x))})
     }).catch(function(error) {
       console.log(error)
     });
   });

}

function onError(err) {
   console.error(err);
}

QrReader.getBackCamera().then(function(device) {
   new QrReader({
       sucessCallback: onSuccess, // Required
       errorCallback: onError, // Required
       videoSelector: '#video', // If not provided creates an invisible element and decode in background
       stopOnRead: true, // Default false, When true the video will stop once the first QR is read.
       deviceId: device.deviceId, // Id of the device used for recording video.
   });
});
