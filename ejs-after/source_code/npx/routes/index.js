var express = require('express');
var router = express.Router();
const multer = require("multer");
const fs = require('fs');

//Backend routes (endpoints)

const host = "http://localhost:3001"
//const host = "http://3.232.168.176:3001"

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
const uri = 'mongodb+srv://peterbuo:m3x93WLJhWFagQP@inventorysite.lbmkkjb.mongodb.net/?retryWrites=true&w=majority'
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
});
// Compile schema to a Model (create "Item")
const Item = mongoose.model('Item', itemSchema);


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

//endpoint to add an item to the DB!!!!!
// server recieved client request.
router.post('/addItem', upload.array("image"), add);

function add(req, res)
{
  let name = req.body.name;
  let qty = req.body.qty;
  let details = req.body.details
  let id = req.body.id; //if 'none' we are adding
  let img = (req.files.length > 0) ? host+"/images/"+req.files[0].filename: ""
  // the img file, if any, is passed through the FormData object where we can read .files through multer middleware
  

  // doesnt exist so add it
  if (id == "none")
  {
    const newItem = new Item({"name": name, "qty": qty, "img": img, "details": details})
    newItem.save().then(function(value) {
    // THIS IS THE RESPONSE THE CLIENT WILL GET! return the id to them so we can reference this new item without reloading
    res.json({"name": name, "qty": qty, "img": img, "details": details, id: value._id}) 
})
  }

  else // it exists so find the id and update the database!
  {
    if (req.files.length === 0) // we are not changing the image
    {
      Item.findByIdAndUpdate(id, {"name": name, "qty": qty, "details": details})
        .then(function(value) {
          res.json({"name": name, "qty": qty, "details": details, id: value._id}) 
        }) 
    }
    else // we are updating the image! delete the previous one.
    {
      deleteByURL(req.body.prevImg)

      Item.findByIdAndUpdate(id, {"name": name, "qty": qty, "img": img, "details": details})
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
