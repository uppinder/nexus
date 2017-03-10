var Imap = require('imap');

exports.verifyUser = function(userDetails, cb) {

  process.env.http_proxy = '';
  process.env.https_proxy = '';
  process.env.HTTP_PROXY = '';
  process.env.HTTPS_PROXY = '';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  var imap = new Imap({
    user: userDetails.username,
    password: userDetails.password,
    host: userDetails.mailServer,
    port: 993,
    tls: true
  });

  imap.connect();

  imap.once('ready', function() {
    console.log('OK');
    imap.end();
    cb(true);
  });

  imap.once('error', function(err) {
    console.log('FAIL');
    cb(true);
  });
};
