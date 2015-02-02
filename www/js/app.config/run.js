// Angular Run (part of configure)

angular
    .module('mailbox')
    .run(RunConfigure);

RunConfigure.$inject = ['$ionicPlatform'];

function RunConfigure ($ionicPlatform) {
    $ionicPlatform.ready(ReadyConfigure);
}

function ReadyConfigure () {
    if (window.cordova && window.cordova.plugins.Keyboard)
    {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar)
    {
        StatusBar.styleDefault();
    }
}