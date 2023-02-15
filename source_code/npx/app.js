//change localhost to instance url on frontend
// npm run build
// copy contents of build/ to server public file
// add node modules to git ignore
// on amazon instance console, do git clone 
// cd to npx (server)
// and then do npm install, npm startw

var express = require('express');
var path = require('path');
var cors = require('cors');

var app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
}
)

app.get('/add/:firstNumber/and/:secondNumber', (req,res)=>{
  console.log(req.params.firstNumber + req.params.secondNumber);
  console.log("Test log");
  //Checkout console to see why parseInt is essential in this case.
  let firstNo = parseInt(req.params.firstNumber),
      secondNo = parseInt(req.params.secondNumber);
  res.json({"addition" : firstNo + secondNo});
});

