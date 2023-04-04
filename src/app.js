const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mysqlStore = require('express-mysql-session');
const { database } = require('./keys');
const passport = require('passport');

//Initializations
const app = express();
require('./lib/passport');

//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs',
    helpers: require('./lib/handlebars')}));
app.set('view engine', '.hbs');
// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
    secret: 'flash session',
    resave: false,
    saveUninitialized: false,
    store: new mysqlStore(database)
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Global variables
app.use((req,res,next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//Routes
app.use(require('./routes'));
app.use(require('./routes/authentications'));
app.use('/objetivos',require('./routes/objetivos'));
app.use('/riesgos',require('./routes/riesgos'));
app.use('/profile',require('./routes/profile'));
app.use('/no_conforme',require('./routes/no_conforme'));
//Public
app.use(express.static(path.join(__dirname, 'public')));



module.exports = app;