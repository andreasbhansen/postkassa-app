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
        addDeviceToMailbox: function (devicePushToken, mailboxId)
        {
            /*            return $http({
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
             });*/

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
        removeDeviceFromMailbox: function (devicePushToken, mailboxId)
        {

        }
    }
}