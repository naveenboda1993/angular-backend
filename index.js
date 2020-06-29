const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const path = require('path');
const cors = require('cors')

const userRoutes = require('./routes/users'),
      superadminRoutes= require('./routes/superadmin'),
      imageUploadRoutes = require('./routes/image-upload');
      facultyRoutes = require('./routes/faculty');
      dealsRoutes = require('./routes/deal');
      webinarRoutes = require('./routes/webinar');
      subscriberRoutes = require('./routes/subscriber');
      courseRoutes = require('./routes/course');

mongoose.connect(config.DB_URI,{ useNewUrlParser: true }).then(() => {
 console.log('connected to db')
});

const app = express();
const server = require('https').createServer(app);

// io.on('connection', () => { /* … */ });
var io = require('socket.io')(server);
server.listen(3000);


app.use(bodyParser.json());
app.use(cors());
// app.use((req, res, next) => {
//   if(req.protocol === 'http') {
//     res.redirect(301, `https://${req.headers.host}${req.url}`);
//   }
//   next();
// });

app.use('/api/v1/users', userRoutes);
app.use('/api/v1', imageUploadRoutes);
app.use('/api/v1/superadmin',superadminRoutes);
app.use('/api/v1/faculty', facultyRoutes);
app.use('/api/v1/subscriber', subscriberRoutes);
app.use('/api/v1/deals', dealsRoutes);
app.use('/api/v1/webinar', webinarRoutes);
app.use('/api/v1/course', courseRoutes);

if (process.env.NODE_ENV === 'production') {
  const appPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(appPath));

  app.get('*', function(req, res) {
    res.sendFile(path.resolve(appPath, 'index.html'));
  });
}


// ==================================

let nodemailer = require("nodemailer");
let cron = require('node-cron');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'tech.skolors@gmail.com',
    pass: 'tech@pishyd2019'
  }, tls: {
    rejectUnauthorized: false
  }
});

let Webinar = require('./models/webinar');

cron.schedule('*/5 * * * *', () => {
  // */5 * * * *
  // Send e-mail
  let today = new Date();
  let tomorrow = new Date(today);
  tomorrow.setHours(24, 0, 0, 0);
  Webinar.find({ date: { $gte: today, $lt: tomorrow } }).populate({ path: 'users.user', model: 'Subscriber' }).then((data) => {
    data.forEach(single => {
      let time = new Date(today);
      let next_10min = new Date(time.setMinutes(time.getMinutes() + 10));
      if (single.date >= today && single.date < next_10min) {
        single.users.forEach(student => {
          if (student.user.email) {
            let mailOptions = {
              from: 'rajashekarm022@gmail.com',
              to: student.user.email,
              subject: 'Webinar',
              html: `<h1 style="text-align:center">Webinar is going to start in few minutes</h1><br/><p style="text-align:center">To attend the webinar visit this link</p><br/><a style="text-align:center" href=` + single.link + `>click here</a>`
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
          }
        })
      }
    })
  }).catch((err) => { console.log(err); })

});

// ====================================

const PORT = process.env.PORT || 3001;

app.listen(PORT , function() {
  console.log('App is running!');
});
