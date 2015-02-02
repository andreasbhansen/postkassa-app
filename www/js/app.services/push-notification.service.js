/* * * * * * * * *
 *
 * Push notification service
 *
 * * * * * * * * */

angular
    .module('mailbox')
    .service('PushNotificationService', PushNotificationService);


PushNotificationService.$inject = ['BackendService', 'LocalDatabaseService', '$rootScope'];

function PushNotificationService (BackendService, LocalDatabaseService, $rootScope) {
    return {
        deviceReady: function (mailboxId, mailboxName) {
            document.addEventListener("deviceready", function ()
            {

                var pushNotification = window.plugins.pushNotification;

                pushNotification.onDeviceReady(
                    {
                        projectid: "956627426163",
                        appid: "0456C-F5F07"
                    }
                );

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

                pushNotification.registerDevice(
                    function (status)
                    {
                        var pushToken = status;


                        window.localStorage['token'] = status;

                        LocalDatabaseService
                            .addMailboxToDB(mailboxId, mailboxName)
                            .then(function (res) {
                                $rootScope.$broadcast('alerter:mailbox-added', res);
                            });

                        /*BackendService
                            .addDeviceToMailbox(pushToken, mailboxId)
                            .then(function (res) {
                                console.log(JSON.stringify(res));
                            });*/
                    },
                    function (status)
                    {
                        alert(JSON.stringify(['failed to register ', status]));
                    }
                );

            }, false);

        }
    }
}