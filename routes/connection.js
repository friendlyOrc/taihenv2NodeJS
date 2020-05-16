var mysql = require('mysql');
var connection;
var db_config = {
  host     : 'us-cdbr-east-06.cleardb.net',
  user     : 'bcc8fd8e5ad3d2',
  password : 'aa0ecdeb',
  database: "heroku_85e7c5d6d301ddc",
  dateStrings: true
};

function handleDisconnect() {
  connection = mysql.createPool(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  // connection.connect(function(err) {              // The server is either down
  //   if(err) {                                     // or restarting (takes a while sometimes).
  //     console.log('error when connecting to db:', err);
  //     handleDisconnect(); 
  //   }                                     
  // });                                    
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

module.exports = connection;


// host     : 'us-cdbr-east-06.cleardb.net',
// user     : 'bcc8fd8e5ad3d2',
// password : 'aa0ecdeb',
// database: "heroku_85e7c5d6d301ddc",
// dateStrings: true

// host: "localhost",
//     user: "root",
//     password: "G34r1#c42&",
//     database: "taihen",
//     dateStrings: true