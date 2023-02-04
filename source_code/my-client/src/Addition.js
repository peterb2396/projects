import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import './styles.css';

const Addition = () => {
  const [sum, setSum] = useState(0);
  const [first, setFirst] = useState(0);
  const [second, setSecond] = useState(0);
  const add = () => {
      setFirst((first) => parseInt(document.getElementById("num1").value)
       );
       
        setSecond((second) => parseInt(document.getElementById("num2").value)
       );
      setSum((sum) => first + second);
      
}


  return (
    <div className="Addition" id="main">
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
      
<nav class="navbar" style={{ backgroundColor: "#f2f2f2"}}
    id="navbar">

  <div class="container-fluid">
    <a class="navbar-brand" href="!#">
       <img src="https://getbootstrap.com/docs/5.2/assets/brand/bootstrap-logo-shadow.png" alt="Bootstrap Logo" width="30" height="24" class="d-inline-block align-text-top"></img>
    Peter's Cool Website
    </a>
  </div>
</nav>


     
<div class="form-group" id="test">
    <div id = "test">
      <span id = "test">First Number: </span>
      </div>
    <input type="number" class="form-control" id="num1" placeholder="First Number"></input>
</div >

<div class="form-group" id="test">
      <span>Second Number: </span>
    <input type="number" class="form-control" id="num2" placeholder="Second Number"></input>
</div>
  
     <button type="button" class="btn btn-primary" onClick={add}>Submit</button>
      <p>Sum = {sum} </p>

   
    </div>
  );
};

export default Addition;