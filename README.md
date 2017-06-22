# sinf-mobileapp

mobile app solution for sinf project 16/17 year

## Getting Started

### Prerequisites

- [Node.js & npm](http://nodejs.org) Node ^4.2.3, npm ^2.14.7
- [Bower](bower.io) (`npm install --global bower`)
- [Gulp](http://gulpjs.com) (`npm install --global gulp`)
- [Ionic](http://ionicframework.com) (`npm install --global ionic`)
- [Cordova](http://cordova.apache.org) (`npm install --global cordova`)
- [Android SDK](http://dl.google.com/android/installer_r24.4.1-windows.exe) (install `Android SDK Tools`^25.2.2, `Android SDK Platform Tools`^25.0, `Android SDK Build Tools`^25.0, `Android 7.0 (API24) -> SDK Platform`)

### Developing

1. Run `cd mobileapp`
2. Run `npm install` to install server dependencies.
3. Run `bower install` to install front-end dependencies.
4. Run `ionic state reset` to configure target platforms.

## Build & deployment
- Run `ionic serve` to start the development server on your computer. It should automatically open the client in your browser when ready.
- Run `ionic run android` to test your application on your Android device (if connected through USB)
- Run `ionic emulate android` to test your application on an Android virtual machine (must be previously configured using `AVD Manager`, which is included in the Android SDK)
