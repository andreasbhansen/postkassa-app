/* * * * * * * * *
 *
 * Local database service
 *
 * * * * * * * * */

angular
    .module('mailbox')
    .service('LocalDatabaseService', LocalDatabaseService);

LocalDatabaseService.$inject = ['$cordovaSQLite', '$q', 'BackendService'];

var db = null;


function LocalDatabaseService($cordovaSQLite, $q, BackendService)
{

    var mailboxes = [];

    return {
        isMailboxAlreadyInDB: function (mailbox_id)
        {
            var q = $q.defer();

            var exists = false;
            var doesMailboxExistInDBQuery = "SELECT * FROM mailboxes WHERE mailbox_id = ?";
            db = $cordovaSQLite.openDB('app');
            $cordovaSQLite
                .execute(db, doesMailboxExistInDBQuery, [mailbox_id])
                .then(function (res)
                {
                    console.log(JSON.stringify(res));

                    exists = res.rows.length >= 1;
                    console.log(exists);
                    q.resolve(exists);
                });

            return q.promise;
        },
        removeDB: function ()
        {
            $cordovaSQLite.deleteDB('app', function (success)
            {
                alert(success);
            }, function (err)
            {
                alert(err);
            });
        },
        addMailboxToDB: function (mailbox_id, mailbox_name)
        {
            var q = $q.defer();

            var createTableIfNotExistsQuery = "CREATE TABLE IF NOT EXISTS mailboxes (id integer primary key, mailbox_id text, mailbox_name text)";
            db = $cordovaSQLite.openDB('app');
            $cordovaSQLite
                .execute(db, createTableIfNotExistsQuery)
                .then(function (res)
                {
                    var dbquery = "INSERT INTO mailboxes (mailbox_id, mailbox_name) VALUES (?, ?)";
                    $cordovaSQLite
                        .execute(db, dbquery, [mailbox_id, mailbox_name])
                        .then(function (res)
                        {
                            q.resolve(res);
                        }, function (err)
                        {
                            q.reject(err);
                        });

                });
            return q.promise;
        },
        removeMailboxFromLocalDB: function (mailbox)
        {
            var q = $q.defer();

            var removeMailboxQuery = "DELETE FROM mailboxes WHERE id = ?";

            db = $cordovaSQLite.openDB('app');

            $cordovaSQLite
                .execute(db, removeMailboxQuery, [mailbox.id])
                .then(function (res)
                {
                    q.resolve(res);
                }, function (err)
                {
                    q.reject(err);
                });
            return q.promise;
        },
        fetchMailboxListFromDB: function ()
        {
            var q = $q.defer();

            var createTableIfNotExistsQuery = "CREATE TABLE IF NOT EXISTS mailboxes (id integer primary key, mailbox_id text, mailbox_name text)";
            db = $cordovaSQLite.openDB('app');
            $cordovaSQLite
                .execute(db, createTableIfNotExistsQuery)
                .then(function (res)
                {
                    var query = "SELECT * FROM mailboxes";

                    $cordovaSQLite
                        .execute(db, query, [])
                        .then(function (res)
                        {
                            if (res.rows.length > 0)
                            {
                                for (var i = 0; i < res.rows.length; i++)
                                {
                                    var obj = res.rows.item(i);
                                    mailboxes.push(obj);
                                }

                                //return mailboxes;
                                q.resolve(mailboxes);
                            }
                            else
                            {
                                alert("No mailboxes found. Add one!");
                            }

                        }, function (err)
                        {
                            alert(err);
                            q.reject(err);
                        });
                });
            return q.promise;
        }
    }
}