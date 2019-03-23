const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user')
const Grid = require('gridfs-stream')



//exposes the user to all routes
router.get('*',  (req, res, next)=>{
    res.locals.user = req.user || null;
    next();
})


//homepage
router.get('/', (req, res)=>{
    res.render('index',{
        user : req.user
    });
});

//sign up page
router.get('/register', (req ,res)=>{
    res.render('register', {
        message : req.flash('reg-messages'),
        user : req.user
       
    })
});

//login page
router.get('/login', (req ,res)=>{
    res.render('login', {
        message : req.flash('login-msg'),
        
    })
});

//google login
router.get('/google', passport.authenticate('google', {
    //data needed
    scope:['profile']
}))

//google redirect
router.get('/google/redirect', passport.authenticate('google',{
    successRedirect: '/carme/username',
    failureRedirect: '/carme/login'
}) )


//facebook login
router.get('/facebook', passport.authenticate('facebook', {
   
}))

//google redirect
router.get('/facebook/redirect', passport.authenticate('facebook',{
    successRedirect: '/carme/username',
    failureRedirect: '/carme/login'
}) )



//logout
router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('login')
})

//user-page
router.get('/username', isLoggedIn, (req ,res)=>{
    res.render('user', {
        user : req.user,
        message : req.flash('success'),
        message2 : req.flash('error'),

    })
});


//user-details-page
router.get('/user-details', isLoggedIn, (req ,res)=>{
    res.render('user-details')
});


//user-upload-page
router.get('/username/upload-car', isLoggedIn,  (req ,res)=>{
    res.render('upload-car')
});



//user-car-detals-page
router.get('/username/car-details', (req ,res)=>{
    res.render('car-details')
});


//user-request-page
router.get('/username/request', (req ,res)=>{
    res.render('request')
});


//user-accept-page
router.get('/username/accept/id', (req ,res)=>{
    res.render('accept')
});


function isLoggedIn (req,res, next){
    if(req.isAuthenticated())
    return next();
    
    res.redirect('/carme/login')
}



module.exports = router



