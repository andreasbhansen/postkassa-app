/* * * * * * * * *
 *
 * Backend service
 *
 * * * * * * * * */

angular
    .module('mailbox')
    .service('BackendService', BackendService);

BackendService.$inject = ['$http', '$q'];

function BackendService($http, $q)
{
    return {
        addDeviceToMailboxObject: function (devicePushToken, mailboxId)
        {
            return $http
                .post('http://mailbox.theneva.com/register-device', {
                    params: {
                        mailbox_id: mailboxId,
                        token: devicePushToken
                    }
                })
                .then(
                function (res)
                {
                    console.log(JSON.stringify(res));
                },
                function (err)
                {
                    console.log(JSON.stringify(err));
                }
            );

        },
        removeDeviceFromMailboxObject: function (devicePushToken, mailboxId)
        {
            return $http
                .put('http://mailbox.theneva.com/remove-device-from-mailbox', {
                    params: {
                        mailbox_id: mailboxId,
                        token: devicePushToken
                    }
                })
                .then(
                function (res)
                {
                    console.log(JSON.stringify(res));
                },
                function (err)
                {
                    console.log(JSON.stringify(err));
                }
            );

        }
    }
}