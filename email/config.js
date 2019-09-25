let nodemailer = require('nodemailer');


module.exports.GmailTransport = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  tls: true,
  auth: {
      user: 'liuchunyi1987@hotmail.com', // generated ethereal user
      pass: 'baza7183' // generated ethereal password
  }
});


module.exports.ViewOption = (transport, hbs) => {
    transport.use('compile', hbs({
            viewEngine: {
              extname: '.hbs', // handlebars extension
              defaultLayout: false, // name of main template
              partialsDir: 'views/email/', // location of your subtemplates aka. header, footer etc
            },
            viewPath: 'views/email',
            extName: '.hbs'
    }));
}
