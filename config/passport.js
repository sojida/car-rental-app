const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook')
const keys = require('../keys/keys');

//user model
const User = require('../models/user');

//passport function
module.exports = function(passport){
   //serialize user
   passport.serializeUser(function(user, done){
    done(null, user.id)
   })

   passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done (err, user)
        })
   })

    //registration process
    passport.use('local-register', new LocalStrategy({
    
        passReqToCallback: true
    },
        
            
        (req,username, password, done)=>{
       
        process.nextTick(function(){
            let usernameCheck = {'local.username': username}
           
      
            User.findOne(usernameCheck, (err, user)=>{
                
                if (err) return done(err);

                if (user){
                    return done(null, false, req.flash('reg-messages', 'username or email has already been used' ))
                } else {
                    newUser = new User({
                        'local.fullname':req.body.fullname,
                        'local.username': username,
                        'local.email': req.body.email,
                        
                    })
                  //to hash the password
                    newUser.local.password = newUser.generateHash(req.body.password)

                    newUser.save((err)=>{
                        if (err) throw err;
                        return done(null, newUser);
                    })
                }


            });
        });
    }));

    //local login
    passport.use('local-login', new LocalStrategy({
        usernameField:'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        
        function(req, email, password, done){
            //checks for the email
            emailCheck = {'local.email': email}

            //To check for the user name
            // usernameCheck = {'local.username': req.body.email}
       
        User.findOne(emailCheck, function (err, user){  

            if (err)
                return done(err);
  
            if (!user)
                return done(null, false, req.flash('login-msg', 'No user found'));

            if (!user.validPassword(password))
                return done (null, false, req.flash('login-msg', 'Wrong password'));


            return done(null, user);
            
            
        })
    }));


    //google process to sign in 
    passport.use(
        new GoogleStrategy({
            //provide details from google 
            clientID: keys.google.id,
            clientSecret: keys.google.secret,
            callbackURL: '/carme/google/redirect',
            passReqToCallback: true
        }, (req, accessToken, refreshToken, profile, done)=>{
           //cb function
          process.nextTick(()=>{
                
            if (!req.user){

                googleID = {'google.id': profile.id}

                User.findOne(googleID).then((currentUser)=>{
                    if (currentUser){
                        console.log('User found')
                        done(null, currentUser)
                    } else {
                        new User({
                            'google.id': profile.id
                        }).save().then((newUser)=>{
                            done(null, newUser)
                        });
                    }
                })
               
            }  else {
                googleID = {'google.id': profile.id}
                User.findOne(googleID).then((userPresent)=>{
                    if (userPresent){
                        return done(null, req.user, req.flash('error', 'That account has already been used'))
                    } else {
                        user = req.user
                        user.google.id = profile.id
                        user.save((err)=>{
                            if (err)
                            throw err
                            done(null, user, req.flash('error', 'Link Successful'))
                        })

                    }
                })
            }
          })
        })
    );



    //facebook process to sign in 
    passport.use(
        new FacebookStrategy({
            //provide details from google 
            clientID: keys.facebook.id,
            clientSecret: keys.facebook.secret,
            callbackURL: '/carme/facebook/redirect',
            passReqToCallback: true
        }, (req, accessToken, refreshToken, profile, done)=>{
            //cb function
            process.nextTick(()=>{
                
                ///when user is not logged in
            if (!req.user){

                facebookID = {'facebook.id': profile.id}

                User.findOne(facebookID).then((currentUser)=>{
                    if (currentUser){
                        done(null, currentUser)
                    } else {
                        new User({
                            'facebook.id': profile.id
                        }).save().then((newUser)=>{
                            done(null, newUser)
                        });
                    }
                })
                ///user is logged in
            }  else {
                facebookID = {'facebook.id': profile.id}
                User.findOne(facebookID).then((userPresent)=>{
                    if (userPresent){
                        return done(null, req.user, req.flash('error', 'That account has already been used'))
                    } else {
                        user = req.user
                        user.facebook.id = profile.id
                        user.save((err)=>{
                            if (err)
                            throw err
                            done(null, user, req.flash('error', 'Link Successful'))
                           
                        })

                    }
                })
            }
            })
        })
    );

    // //to autorize users
    // passport.use('google-auth', new GoogleStrategy({
    //     clientID: keys.google.id,
    //     clientSecret: keys.google.secret,
    //     callbackURL: '/carme/google/redirect',
    //     passReqToCallback: true
    // }, (req, accessToken, refreshToken, profile, done)=>{
    //     userID = {'_id': req.user._id}
    //     User.findOne(userID).then((user)=>{
    //         user = req.user

    //        user.google.id = profile.id
    //        user.save((err)=>{
    //            if (err)
    //            throw err
    //            done(null, req.user)
    //            console.log(req.user)

    //        })

    //     })


    // })
    
    // );

}