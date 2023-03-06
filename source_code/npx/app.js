
// on amazon instance console, do git clone 
// cd to npx (server)
// and then do npm install, npm startw
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
var express = require('express');

var path = require('path');
var cors = require('cors');



var app = express();
app.use(cors());

app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//app.use (fileupload());
app.use (express.urlencoded({extended: true}));

//db connection
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


const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
}
)


// Set up DB!

// My schema can also have methods if i want.... such as displayDetails.
const itemSchema = new mongoose.Schema({
  name: String,
  qty: Number,
  img: Map,
});
// Compile schema to a Model (create "Item")
const Item = mongoose.model('Item', itemSchema);





//API endpoints



//endpoint to add an item to the DB!!!!!
// server recieved client request.
//app.post('/addItem/:name/:qty/:id', upload.array("files"), uploadFiles);

app.post('/addItem/:name/:qty/:id', (req,res) => {
  let name = req.params.name;
  let qty = req.params.qty;
  let img = req.files; // i am now trying to pass through payload rather than uri
  let id = req.params.id; //if none we are adding

  console.log(req.files)
  

  // doesnt exist so add it
  if (id == "none")
  {
    const newItem = new Item({"name": name, "qty": qty, "img": img})
    newItem.save().then(function(value) {
    // Get the new object, _id is what i want!
    //console.log(value);
    // THIS IS THE RESPONSE THE CLIENT WILL GET!
    res.json({"name": name, "qty": qty, "img": img, id: value._id}) 
})
  }

  else // it exists so find the id and update
  {
    Item.findByIdAndUpdate(id, {"name": name, "qty": qty, "img": img})
    .then(function(value) {
      //console.log(req.files)
      res.json({"name": name, "qty": qty, "img": img, "id": value._id}) 
  }) //id will remain the same
    
  }
  


});


// get all items
app.get('/getAllItems', (req,res) => {
  
  // return result query, should i parse it here?
  findAll(res)
  

})

//delete one item
app.get('/delete/:id', (req, res) => {
  
  Item.deleteOne({_id: req.params.id})
  .then(
    res.json({result: "success"})
  )
  .catch(
    res.json({result: "fail"})
  )
})




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
    //console.log(res)
    myres.json(res)

  }




//Addition endpoint
app.get('/add/:firstNumber/and/:secondNumber', (req,res)=>{

  let firstNo = parseInt(req.params.firstNumber),
      secondNo = parseInt(req.params.secondNumber);
  res.json({"addition" : firstNo + secondNo});
});

