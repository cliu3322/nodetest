let nodemailer = require('nodemailer');
let path = require('path');
// module.exports.GmailTransport = nodemailer.createTransport({
//   host: 'smtp-mail.outlook.com',
//   port: 587,
//   tls: true,
//   auth: {
//       user: 'liuchunyi1987@hotmail.com', // generated ethereal user
//       pass: 'baza7183' // generated ethereal password
//   }
// });

module.exports.from = 'claims@regencyforexpats.com';

module.exports.GmailTransport = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  tls: true,
  auth: {
      user: 'azure_cdfff3a3a4afbae34d599e84ed8ab594@azure.com', // generated ethereal user
      pass: 'bp8DQ=a2#KhBq7JvXfLY' // generated ethereal password
  }
});

//
// module.exports.GmailTransport = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 587,
//   tls: true,
//   auth: {
//       user: 'eric.sqlserver@gmail.com', // generated ethereal user
//       pass: 'baza7183' // generated ethereal password
//   }
// });


module.exports.ViewOption = (transport, hbs) => {
    transport.use('compile', hbs({
            viewEngine: {
              extname: '.hbs', // handlebars extension
              layoutsDir: 'views/email/',
              defaultLayout: 'template', // name of main template
              partialsDir: path.resolve('./views/partials/'), // location of your subtemplates aka. header, footer etc
            },
            viewPath: 'views/email/',
            extName: '.hbs'
    }));
}
