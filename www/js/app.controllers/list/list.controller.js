/* * * * * * * * *
 *
 * List controller
 *
 * * * * * * * * */

angular
    .module('mailbox')
    .controller('ListCtrl', ListController);

// Dependency injection
ListController.$inject = ['$scope', '$ionicPlatform', 'LocalDatabaseService', 'BackendService'];


/* * * * * * * * *
 * Main controller function
 * * * * * * * * */

function ListController($scope, $ionicPlatform, LocalDatabaseService, BackendService)
{
    var vm = this;

    vm.boxes = [];
    vm.removeMailbox = removeMailbox;


    // Ensure that Ionic is ready to go (only for initial database fetching)!
    $ionicPlatform.ready(function ()
    {
        fetchMailboxes()
            .then(function (data)
            {
                vm.boxes = data;
            })
    });

    // Subscribe to newly added mailboxes
    $scope.$on('alerter:mailbox-added', function (event, data)
    {
        updateTableOnChange();
    });


    /* * * * * * * * *
     * Helper functions
     * * * * * * * * */

    function fetchMailboxes()
    {
        return LocalDatabaseService.fetchMailboxListFromDB();
    }

    function updateTableOnChange()
    {
        // Clean cache box array before receiving updated from database
        vm.boxes.length = 0;
        vm.boxes = [];
        fetchMailboxes()
            .then(function (data)
            {
                vm.boxes = data;
            })
    }

    function removeMailbox(box)
    {
        var token = window.localStorage['token'];
        LocalDatabaseService
            .removeMailboxFromLocalDB(box)
            .then(function (localRes)
            {
                //aole.log(res);
                updateTableOnChange();

                console.log(token);
                console.log(box.mailbox_id);
                BackendService
                    .removeDeviceFromMailboxObject(token, box.mailbox_id)
                    .then(function (remoteRes)
                    {
                        console.log(JSON.stringify(remoteRes));
                    });
            });
    }
}