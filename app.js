const express = require('express');
const app = express();
const routes = require('./routes/mainroutes');
const postRoutes = require('./routes/postroutes')
const mongoose = require('mongoose');
const db = require('./config/database');
const Grid = require('gridfs-stream')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const validator = require('express-validator')



// ///google setup
// const googlePassportSetup = require('./config/google-passport')





//vew engine
app.set('view engine', 'ejs')

//static files
app.use('/public', express.static('public'));

//bodyparser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());  

//validador
app.use(validator())

//set up passport
app.use(session({
    secret:'danny',
    resave: true,
    saveUninitialized : true,

}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())


//routes
app.use('/carme' , routes);
app.use('/carme' , postRoutes);



//initialize passport
require('./config/passport')(passport);







//connect mongoose and intialise stream for pictures
mongoose.connect(db.url,{useNewUrlParser: true})
const conn = mongoose.createConnection(db.url, {useNewUrlParser: true});
let gfs;
conn.once('open', ()=>{
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads')
    console.log('Connected to the database and stream initialised');
}).on('err', (err)=>{
    console.log(err)
});


//user-upload car pic
app.get('/carme/username/car-pic', (req,res)=>{
    gfs.files.find().toArray((err, files)=>{
        res.render('car-pic', {
            file : files
        })
    });
});

//api to access these picures
app.get('/image/:filename', (req,res)=>{
    gfs.files.findOne({filename: req.params.filename}, (err, file)=>{
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/jpg'){
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res)
        }
    })
});


//connect to the server
app.listen(3000, ()=>{
    console.log('Connected to Server')
});