import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import './styles.css';

const Addition = () =>  {

  const [sum, setSum] = useState(0);
  function add() { setSum((sum) => readSum()); }

function readSum()
 {
    let x = parseInt(document.getElementById("num1").value);
    let y = parseInt(document.getElementById("num2").value);
    return (x+y);
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


<div id = "mypanel">
     <div id ="image">
        <img id="headshot" src = "headshot.png" alt ="Headshot">
        </img>
     </div>

    <div id="mydetails">
       <span id = "myname">
       Peter Buonaiuto</span>
       <p> 
       My name is peter and im so cool</p>
    </div>
</div>

<div id ="entry">
<div>
 <span id="numberlabel" >First Number: </span>
    <div class="form-group" id="test">
        <input type="number" class="form-control" id="num1"     placeholder="First Number"></input>
    </div >
</div>

<br/>

<div>
    <span id="numberlabel" >Second Number: </span>
    <div class="form-group" id="test">
          <input type="number" class="form-control" id="num2" placeholder="Second Number"></input>
    </div>
</div>
</div>  

  <br/>
     <button type="button" class="btn btn-primary" 
     style= {{ margin: "10px" }} onClick={add}>Submit</button>
     
      <p style= {{ padding: "10px" }}>Your Addition result from server = {sum} 
      <br/>
      Your Addition result from ReactJS = {readSum}
      
      </p>

   
    </div>
  );
};

export default Addition;