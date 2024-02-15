const express = require('express');
const cors = require("cors");
const path = require('path');
const mongoose = require('mongoose');
const newUpload = require('./routes/newUpload')
const showPhotoes = require('./routes/showPhotoes')
mongoose.connect("mongodb://localhost:27017/blinkituser").then(()=>{console.log("connection done")});
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use('/assets', express.static(path.join(__dirname, 'assets')));
// app.use(cors());
// app.use(express.static("./public"));
app.use(cors());
// app.use(express.json()); // Add this line to parse JSON in the request body
// app.use(express.urlencoded({ extended: true }));
app.use('/newUpload',newUpload)
app.use('/showPhotoes',showPhotoes)
// var storage = multer.diskStorage({

// destination: "./public/images",
// filename: function (req, file, cb) {
// cb(null, Date.now() + '-' +file.originalname )
// }
// })

// var upload = multer({ storage: storage }).array('file');

// app.post('/upload',function(req, res) {
//     console.log('upload')
//     upload(req, res, function (err) {
//            if (err instanceof multer.MulterError) {
//                return res.status(500).json(err)
//            } else if (err) {
//                return res.status(500).json(err)
//            }
//       return res.status(200).send(req.file)
    
//     })
    
// });

const newUserSchema = new mongoose.Schema({
    name :String,
    email:String,
    password:String,
})

const User = new mongoose.model("newUser",newUserSchema)

// testUser.save().then(() => {console.log("data saved")})
// .catch(err => {console.log(err)})

const getUser = async (email,password) => {
    const result = await User.find({"email":email , "password":password})
    // console.log("result",result)
    // console.log(result[0].name)
    return result;
}

const createUser = async (name , email,password) => {
    const testUser = new User({
        name : name,
        email : email,
        password : password,
    })
    try{
        const res = await testUser.save()
    // console.log(testUser)
    // console.log(res)

    const result = await User.find({"email":email , "password":password})

    // console.log(result)
    
    return res;
    }
    catch (err) {
        console.error(err)
        return null;
    }
    
}

app.post('/login',async (req, res)=>{
    // console.log(req.query);
    console.log("body 1" , req.body);
    const val = await getUser(req.body.email , req.body.password)
    console.log(val)
    if(val)
    res.send(val[0]._id)
    else
    res.send("")
})

app.post('/register',async(req, res)=>{
    console.log(req.data)
    const userNow = await createUser(req.body.name ,req.body.email , req.body.password)
    if(userNow){
    console.log(userNow._id)
    res.send(userNow._id)
    } 
    else{
        console.log("errrrr")
    }
})
    
app.listen(8080);