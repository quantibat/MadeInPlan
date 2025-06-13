// index.js
require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const settings = require('./Express/settings');
const mongoose = require('mongoose');
const passport = require('passport');
const fs = require('fs');
const cookieSession = require('cookie-session');


// 1️⃣ Connection MongoDB
const mongoUri = settings.urlDB;
mongoose.Promise = global.Promise;

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log(`✅ Connected to MongoDB → ${mongoUri}`);
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
});

// 2️⃣ App settings
app.set('desktop_html', __dirname + '/Dist/index.html');
app.set('mobile_html', __dirname + '/../MadeInPlanApp-Mobile/dist/index.html');

// 3️⃣ Middlewares
app.use(morgan('dev', {
    skip: (req, res) => { return (res.statusCode == 304 || req.method == 'OPTIONS') }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(settings.secret));

// 4️⃣ Static files
app.use('/dist', express.static('Dist'));
app.use('/assets', express.static('Assets'));
app.use('/upload', express.static('../Upload'));
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'preprod') {
    app.use('/dist', express.static('../MadeInPlanApp-Mobile/dist'));
}

// 5️⃣ Cookies / Passport
let domain = '.madeinplan.com';
if (process.env.NODE_ENV === 'production') domain = '.madeinplan.fr';
else if (process.env.NODE_ENV === 'preprod') domain = '.myeconomiste.com';

app.use(cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000 * 30, // 1 month
    domain: domain
}));
app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport
require('./Express/Passport/init')(passport);

// 6️⃣ CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// 7️⃣ Upload folder
if (!fs.existsSync(__dirname + '/../Upload/')) {
    fs.mkdir(__dirname + '/../Upload/', (err) => {});
}

// 8️⃣ Routes
require('./Express/Routes/auth')(app, passport);
require('./Express/Routes/account')(app);
require('./Express/Routes/money')(app);
require('./Express/Routes/notifications')(app);
require('./Express/Routes/inspiration')(app);
require('./Express/Routes/budget')(app);
require('./Express/Routes/todolist')(app);
require('./Express/Routes/upload-plan')(app);
require('./Express/Routes/administrative-documents')(app);
require('./Express/Routes/plan')(app);
require('./Express/Routes/credit')(app);
require('./Express/Routes/form')(app);
require('./Express/Routes/contact')(app);
require('./Express/Routes/terrain')(app);
require('./Express/Routes/planConfigurator')(app);
require('./Express/Routes/main')(app);

// 9️⃣ 404 handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 10️⃣ Launch server
const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
    console.log(`🚀 MadeInPlanApp listening on port ${port} | ENV=${process.env.NODE_ENV || 'local'}`);
});
