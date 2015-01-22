// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var db = null;

angular.module('mailbox', ['ionic', 'ngCordova'])

    .run(function ($ionicPlatform, $cordovaSQLite)
    {
        $ionicPlatform.ready(function ()
        {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard)
            {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar)
            {
                StatusBar.styleDefault();
            }
            //CordovaService();

            db = $cordovaSQLite.openDB({name: 'app.db'});
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS mailboxes (id integer primary key, mailbox_name text");


        });
    }).controller('HeaderCtrl', ['$scope', '$cordovaBarcodeScanner', '$ionicPopup', '$http', function ($scope, $cordovaBarcodeScanner, $ionicPopup, $http)
    {

        $scope.unregisterThisDevice = function ()
        {
            var pushNotification = window.plugins.pushNotification;
            alert(pushNotification);

            alert('trigger unreg.!');
            pushNotification.unregisterDevice(function (success)
            {
                alert("SUCCESS")
            }, function (fail)
            {
                alert("FAIL")
            });
        };

        $scope.scanBarcode = function ()
        {
            $cordovaBarcodeScanner.scan().then(function (imageData)
            {

                var confirmPopup = $ionicPopup.confirm({
                    title: 'Adding mailbox',
                    template: 'Are you sure you want to add this mailbox?'
                });

                confirmPopup.then(function (res)
                {
                    if (res)
                    {

                        var mailboxId = imageData.text;

                        alert('inni reg.: ' + mailboxId);


                        document.addEventListener("deviceready", function ()
                        {

                            var pushNotification = window.plugins.pushNotification;

                            pushNotification.onDeviceReady({projectid: "956627426163", appid: "0456C-F5F07"});

                            //set push notifications handler
                            document.addEventListener('push-notification', function (event)
                            {
                                var title = event.notification.title;
                                var userData = event.notification.userdata;
                                navigator.notification.vibrate(1000);
                                pushNotification.setVibrateType();


                                if (typeof(userData) != "undefined")
                                {
                                    console.warn('user data: ' + JSON.stringify(userData));
                                }
                            });


                            // Unregister device
                            /* pushNotification.unregisterDevice(function (success) {
                             alert("SUCCESS")
                             }, function (fail) {
                             alert("FAIL")
                             });*/


                            pushNotification.registerDevice(
                                function (status)
                                {
                                    var pushToken = status;

                                    alert(pushToken);

                                    window.localStorage['token'] = status;
                                    //document.getElementById("test22").value = status;

                                    //BackendService.addDeviceToMailbox(pushToken, mailboxId);


                                    $http({
                                        method: 'post',
                                        url: 'http://mailbox.theneva.com/register-device',
                                        params: {
                                            mailbox_id: mailboxId,
                                            token: pushToken
                                        },
                                        data: {
                                            mailbox_id: mailboxId,
                                            token: pushToken
                                        }
                                    });

                                    request.success(function (data)
                                    {
                                        alert(data.message)
                                    });

                                    request.error(function (err)
                                    {
                                        alert(JSON.stringify(err))
                                    });

                                },
                                function (status)
                                {
                                    alert(JSON.stringify(['failed to register ', status]));
                                }
                            );

                        }, false);

                        /*alert(imageData.text)
                         CordovaService.registerForPush(imageData.text);*/
                    }
                    else
                    {
                        console.log('You are not sure');
                    }
                });

            }, function (error)
            {
                console.log("An error happened -> " + error);
            });
        };

    }]).controller('ListCtrl', ['$scope', '$cordovaBarcodeScanner', '$ionicPopup', '$http', function ($scope, $cordovaBarcodeScanner, $ionicPopup, $http)
    {
        if (window.localStorage['token'])
        {
            $scope.token_id = window.localStorage['token'];
        }

        $scope.boxes = [
            {
                name: "Testboks"
            }
        ];


    }]).service('BackendService', function ($http, $window)
    {

        return {
            addDeviceToMailbox: function (devicePushToken, mailboxId)
            {

                document.getElementById("test").innerText = mailboxId;

                return $http({
                    method: 'post',
                    url: 'http://mailbox.theneva.com/register-device',
                    params: {
                        mailbox_id: mailboxId,
                        token: devicePushToken
                    },
                    data: {
                        mailbox_id: mailboxId,
                        token: devicePushToken
                    }
                });

            },
            removeDeviceFromMailbox: function (devicePushToken, mailboxId)
            {

            }
        }

    }).service('LocalStorageService', function ()
    {
        return {
            addMailboxToLocalStorage: function (mailbox)
            {

            },
            removeMailboxToLocalStorage: function (mailbox)
            {

            }
        }

    }).service('CordovaService', function ($http, BackendService)
    {


        return {
            registerForPush: function (mailboxId)
            {


            }
        };

    });