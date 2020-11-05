const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


module.exports = function(passport){
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
    opts.secretOrKey = 'secretOrKey'

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvv',jwt_payload);
        return done(null, true);
    }));
}