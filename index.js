var express = require('express');
var expressHbs = require('express-handlebars');
var app = express();
var multer = require('multer');


const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.engine('handlebars',expressHbs({
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'main'
}));
app.set('view engine','handlebars');
app.listen(8000);

const uri = 'mongodb+srv://admin:admin@cluster0.andoj.mongodb.net/login?retryWrites=true&w=majority';


const mongoose = require('mongoose');
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('connected')
});
var user = mongoose.Schema({
    username : String,
    password : String,
    avatar : String
})
const userConnect = db.model('users',user)

var tenGoc;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/upload')
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        tenGoc = file.originalname;
        cb(null, tenGoc);
    }

})

var upload = multer({
    storage:storage,
    limits:{
        fileSize: 2 * 1024 * 1024  // max : 2
    },
})

app.post('/insert',upload.single('picture'),async (req,res) =>{
    var user = req.body.username;
    var pass = req.body.password;

    const users = new userConnect({
        username : user,
        password : pass,
        avatar : tenGoc
    })

    await users.save(function (err){
        if(err){
            res.render('register',{message : 'that bai'})
        }else{
            res.render('register',{message : 'thanh cong'})
        }
    })


});

app.get('/',function(req,res){
    res.render('register');
});



