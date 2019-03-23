const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user');
const Car = require('../models/car')
const upload = require('../config/upload')


//registration process
router.post('/register', (req, res, next)=>{

    passport.authenticate('local-register', {
    successRedirect: '/carme/login',
    failureRedirect: '/carme/register',
    failureFlash: true,
    })(req, res, next)
});


router.post('/login', (req, res, next)=>{

    User.findOne({'email': req.body.email}, (err, user)=>{

        passport.authenticate('local-login', {
            successRedirect: '/carme/username',
            failureRedirect: '/carme/login',
            failureFlash: true,
            })(req, res, next)
        })
    
});

///Update details
router.post('/username/user-details', (req, res)=>{

    newUserDetails  = {
        'local.fullname' : req.body.fullname,
        'local.email' : req.body.email,
        'local.username' : req.body.username,
        'userDetails.address1' : req.body.address1,
        'userDetails.address2' : req.body.address2,
        'userDetails.phone': req.body.phone,
        'userDetails.nextOfKin' : req.body.nextOfKin,
        'userDetails.nextOfKinPhone' : req.body.nextOfKinPhone,
        'userDetails.dateOfBirth' : req.body.dateOfBirth,
    }
    
   User.findOneAndUpdate({'_id': req.user.id}, newUserDetails, (err)=>{
        
    if (err) {
        console.log(err)
    }  else {
        req.flash('success', 'updated successfully');
        res.redirect('/carme/username')
    }




    })
    
})


// car posting
router.post('/upload-car' ,(req, res)=>{
    
    carUpload = {
        userId : req.user.id,
        'carDetails.nameOfCar': req.body.nameOfCar,
        'carDetails.modelYear': req.body.modelYear,
        'carDetails.plateNumber': req.body.plateNumber,
        'carDetails.engineNumber': req.body.engineNumber,
        'carDetails.colour': req.body.colour,
        'carDetails.stereo': req.body.stereo,
        'carDetails.spareTime': req.body.spareTime,
        'carDetails.repairTools': req.body.repairTools,
        'carDetails.fireExtinguisher': req.body.fireExtinguisher,
        'carDetails.challenges': req.body.challenges,
        'carDetails.price': req.body.price,
        'carDetails.noteToRenter': req.body.noteToRenter,
        
    }

    new Car(carUpload).save()
    res.redirect('username/car-pic')
    console.log('saved to db')
})


router.post('/car', upload, (req,res)=>{
    res.redirect('/carme/username/car-pic')
})




module.exports = router;