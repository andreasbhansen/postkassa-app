/* * * * * * * * *
 *
 * Header controller
 *
 * * * * * * * * */

angular
    .module('mailbox')
    .controller('HeaderController', HeaderController);

HeaderController.$inject = ['$cordovaBarcodeScanner', '$ionicPopup', 'LocalDatabaseService', 'PushNotificationService'];


/* * * * * * * * *
 * Main controller function
 * * * * * * * * */

function HeaderController($cordovaBarcodeScanner, $ionicPopup, LocalDatabaseService, PushNotificationService)
{

    var vm = this;

    vm.mailbox_name = "";
    vm.scanBarcode = scanBarcode;
    vm.unregisterThisDevice = unregisterThisDevice;


    /* * * * * * * * *
     * Helper functions
     * * * * * * * * */

    function scanBarcode()
    {
        $cordovaBarcodeScanner
            .scan()
            .then(function (imageData)
            {
                var confirmPopup = $ionicPopup.prompt({
                    title: 'Adding new mailbox!',
                    template: 'Enter a name for your mailbox! Examples: Home, Cottage, Work',
                    inputType: 'text',
                    inputPlaceholder: 'Mailbox name...'
                });

                confirmPopup.then(function (popupResult)
                {
                    var mailboxName = popupResult;

                    if (mailboxName === "")
                    {
                        mailboxName = "Unnamed mailbox";
                    }

                    if (popupResult)
                    {
                        var mailboxId = imageData.text;
                        PushNotificationService.deviceReady(mailboxId, mailboxName);
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
    }


    function deleteLocalDatabase()
    {
        LocalDatabaseService.removeDB();
    }

    function unregisterThisDevice()
    {
        var pushNotification = window.plugins.pushNotification;
        alert(pushNotification);

        pushNotification.unregisterDevice(function (success)
        {
            alert("Successfully unregistered this device")
        }, function (fail)
        {
            alert("Failed to unregister device")
        });
    }
}