# Qrlogin-server (proof of concept)
One-time passcode server

## Install
```bash
npm install
```

## SSL certificate
```bash
openssl genrsa -des3 -passout pass:x -out server.pass.key 2048
openssl rsa -passin pass:x -in server.pass.key -out server.key
rm server.pass.key
openssl req -new -key server.key -out server.csr
openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt
```

## Firebase setup
Download your serviceAccountKey.json from Firebase, and change:
* firebase-admin.js
* js-views/app.js
* public/js/front-app.js
* views/app-view.ejs

## Firebase user account (for test)
Change public/js/mobile.js line 21

## Run
```bash
npm start
```
