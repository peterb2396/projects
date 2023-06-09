var express = require('express');
var router = express.Router();
const multer = require("multer");
const fs = require('fs');

//Backend routes (endpoints)

//const host = "http://3.225.12.137:3001"
const host = "http://localhost:3001"


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Addition endpoint
router.get('/add/:firstNumber/and/:secondNumber', (req,res)=>{

  let firstNo = parseInt(req.params.firstNumber),
      secondNo = parseInt(req.params.secondNumber);
  res.json({"addition" : firstNo + secondNo});
});


var mongoose = require('mongoose');
const uri = 'mongodb+srv://peterbuo:m3x93WLJhWFagQP@inventorysite.lbmkkjb.mongodb.net/?retryWrites=true&w=majority' //atlas
//const uri = 'mongodb://mongo:27017' //local (docker service)

async function connect(){
  try {
    await mongoose.connect(uri)
    console.log("Connected to mongoDB")
  }
  catch(error){
    console.log(error)
  }
}


connect();

// Set up DB!

// My schema can also have methods if i want.... such as displayDetails.
const itemSchema = new mongoose.Schema({
  name: String,
  qty: Number,
  img: String,
  details: String,
  op: String,
  editor: String,
  postdate: String,
  editdate: String,
});
// Compile schema to a Model (create "Item")
const Item = mongoose.model('Item', itemSchema);

// User schema for DB
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
// Compile schema to a Model
const User = mongoose.model('User', userSchema);


//API endpoints


// Image reception handling
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "png" || file.mimetype.split("/")[1] === "jpg" || file.mimetype.split("/")[1] === "jpeg") {
    cb(null, true);
  } else {
    cb(new Error("Please upload an image"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

router.post('/login', login);

function login(req, res)
{
  User.find({'username': req.body.username, 'password': req.body.password})
  .then(function(value) {
    if (value.length === 1)
    {
      res.json({'authenticated': true, 'username': value[0].username})
    }
    else
    {
    res.json({'authenticated': false})
  }
    
    
  }) 
  
}

router.post('/signup', signup);

function signup(req, res)
{

  const newUser = new User({'username': req.body.username, 'password': req.body.password})
    newUser.save().then(function(value) 
    {
      // THIS IS THE RESPONSE THE CLIENT WILL GET!
      res.json({username: value.username}) 
    })
}

router.post('/update-account', updateAccount);

// Update this account username and password
function updateAccount(req, res)
{
  User.findOneAndUpdate({'username': req.body.oldUsername}, {'username': req.body.username, 'password': req.body.password})
    .then(function(value) 
    {
      // THIS IS THE RESPONSE THE CLIENT WILL GET!
      res.json({ id: value?._id}) 
    })
}

// given username get password
router.post('/get-password', getPassword)
function getPassword(req, res)
{
  User.findOne({'username': req.body.username})
  .then(function(value) {
    res.json({'password': value?.password})
  })
}

// given username get id
router.post('/get-id', getId)
function getId(req, res)
{
  User.findOne({'username': req.body.username})
  .then(function(value) {
    res.json({'id': value?._id})
  })
}

// given id get name
router.post('/get-name', getName)
async function getName(req, res)
{
  await User.findById(req.body.id)
  .then(function(value) {
    res.json({'username': value?.username})
  })
  .catch((result) => {
    // No id provided, usually when a user is logged out!
    res.json({'username': "ANONYMOUS"})
  })
}

router.post('/getUser', getUser)
function getUser(req, res)
{
  User.find({'username': req.body.username})
  .then(function(value) {
    let exists = (value.length === 1)
    res.json({'exists': exists})
  }) 
}

//endpoint to add an item to the DB!!!!!
// server recieved client request.
router.post('/addItem', upload.array("image"), add);

function add(req, res)
{
  let name = req.body.name;
  let qty = req.body.qty;
  let details = req.body.details
  let op = req.body.op
  let editor = req.body.editor
  let date = req.body.date
  let id = req.body.id; //if 'none' we are adding
  let img = (req.files.length > 0) ? host+"/images/"+req.files[0].filename: ""
  // the img file, if any, is passed through the FormData object where we can read .files through multer middleware
  

  // doesnt exist so add it
  if (id == "none")
  {
    const newItem = new Item({"name": name, "qty": qty, "img": img, "details": details, "op": op, "postdate": date})
    newItem.save().then(function(value) {
    // THIS IS THE RESPONSE THE CLIENT WILL GET! return the id to them so we can reference this new item without reloading
    res.json({"name": name, "qty": qty, "img": img, "details": details, id: value._id}) 
})
  .catch(function(error) {
    console.log("ADDING ITEM FAILED: ", error)
  })
  }

  else // it exists so find the id and update the database!
  {
    if (req.files.length === 0) // we are not changing the image
    { // Only update if something has changed
      // If this exact item exists it was not updated
      Item.findOne({"_id": id, "name": name, "qty": qty, "details": details})
      .then(function(value) {
        if (value)
        {
          res.json({'response': "nothing to change!"})
          // we are done here, abort change because nothing changes
        }
        else
        {
          // We didnt find an exact match which means we must update something!
          Item.findByIdAndUpdate(id, {"name": name, "qty": qty, "details": details, "editor": editor, "editdate": date})
        .then(function(value) {
          res.json({"name": name, "qty": qty, "details": details, id: value._id}) 
        }) 
        .catch((res) => {
          console.log("catch")
        })


        }
      }) 
      .catch((res) => {
        console.log("catch")
      })

    }
    else // we are updating the image! delete the previous one.
    {
      deleteByURL(req.body.prevImg)

      Item.findByIdAndUpdate(id, {"name": name, "qty": qty, "img": img, "details": details, "editor": editor})
        .then(function(value) {
          res.json({"name": name, "qty": qty, "img": img, "id": value._id, "details": details})
        })
    }
    
    
  }
}



// get all items
router.get('/getAllItems', (req,res) => {
  
  // return result query, should i parse it here?
  findAll(res)
  

})

// delete one item
// delete the currentImage as well
router.get('/delete/:id', (req, res) => {

  // Find the image by this id 
  Item.findById(req.params.id)
  .then(function(value) {
    // delete this image if we got a response
    if (value)
      deleteByURL(value.img)
    
  })
  
  Item.deleteOne({_id: req.params.id})
  .then(
    res.json({result: "success"})
  )
})

// Delete the given image by web path
function deleteByURL(url)
{
  // do not allow if url is blank because were trying to delete the entire image folder!!
  if (url == "")
    return;


  // finds the image given by the url on the local machine (server) and tries to delete it
  fs.unlink(process.cwd() + "/public" +url.substring( url.indexOf("/images/")), (err) => {
    if (err) {
        console.log(err) // we couldnt delete the image from the server, but we should continue to delete item from DB.
    }
    // We successfully deleted the old file.
});
}


async function findAll(myres)
{

  Item.find({})
  .then(
    res => found(res, myres),
    err => console.error(`Something went wrong: ${err}`),
  );
    
}

// found the items
function found(res, myres)
  {
    myres.json(res)

  }



module.exports = router;
