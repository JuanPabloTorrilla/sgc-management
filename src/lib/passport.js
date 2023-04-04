const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers')

passport.use('local.signin', new localStrategy ({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM proceso WHERE username = ?', [username]);
    if(rows.length>0){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if(validPassword){
            done(null, user, req.flash('success', 'Welcome '+user.username));
        } else {
            done(null,false,req.flash('message','Invalid password'));
        }
    } else {
        done(null, false, req.flash('message','User does not exist'));
    }
}));

passport.use('local.signup', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},  async (req, username, password, done) => {
        const { area } = req.body;
        const { alcance } = req.body;
        const newUser = {
            username,
            password,
            area,
            alcance,
        };
        newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO proceso SET?', [newUser]);
    newUser.idproceso = result.insertId;
    return done(null,newUser);
}));

passport.serializeUser((user, done) =>{
    done(null, user.idproceso);
});

passport.deserializeUser( async (id, done) => {
    const rows = await pool.query('SELECT * FROM proceso WHERE idproceso = ?', [id]);
    done(null,rows[0]);
});