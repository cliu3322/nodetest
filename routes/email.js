// https://docs.microsoft.com/en-us/outlook/rest/node-tutorial

var express = require('express')
var router = express.Router()
var models = require('../models')
var nodeoutlook = require('nodejs-nodemailer-outlook')
var Imap = require('imap'),
    inspect = require('util').inspect;


var config = {
  imap: {
    user: 'liuchunyi1987@hotmail.com',
    password: 'baza7183',
    host: 'imap-mail.outlook.com',
    port: 993,
    tls: true,
    authTimeout: 3000
  }
}
var imap = new Imap({
  user: 'liuchunyi1987@hotmail.com',
  password: 'baza7183',
  host: 'imap-mail.outlook.com',
  port: 993,
  tls: true
});
function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

// middleware to hanlde errors
const awaitErorrHandlerFactory = middleware => {
  return async (req, res, next) => {
    try {
      await middleware(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a test')
})

router.get('/send', awaitErorrHandlerFactory(async (req, res, next) => {

  imap.once('ready', function() {
    openInbox(function(err, box) {
      if (err) throw err;
      var f = imap.seq.fetch('1:3', {
        bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
        struct: true
      });
      f.on('message', function(msg, seqno) {
        console.log('Message #%d', seqno);
        var prefix = '(#' + seqno + ') ';
        msg.on('body', function(stream, info) {
          var buffer = '';
          stream.on('data', function(chunk) {
            buffer += chunk.toString('utf8');
          });
          stream.once('end', function() {
            console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
          });
        });
        msg.once('attributes', function(attrs) {
          console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
        });
        msg.once('end', function() {
          console.log(prefix + 'Finished');
        });
      });
      f.once('error', function(err) {
        console.log('Fetch error: ' + err);
      });
      f.once('end', function() {
        console.log('Done fetching all messages!');
        imap.end();
      });
    });
  });

  imap.once('error', function(err) {
    console.log(err);
  });

  imap.once('end', function() {
    console.log('Connection ended');
  });

  imap.connect();
}))

module.exports = router
