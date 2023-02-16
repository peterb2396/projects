import React, { useState } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import './styles.css';

const Addition = () => {

  const [sum, setSum] = useState({ clientSum: 0, serverSum: 0});
  const [nums, setNums] = useState({ num1: 0, num2: 0 });
  const [name, setName] = useState("Peter Buonaiuto");
  const [desc, setDesc] = useState("My name is Peter and I'm a Comp Sci masters student also completing my bachelors this semester. I like to program tools for construction because I'm into home construction as well as coding.");

  function updateNums(event) {
    const newValues = {...nums, [event.target.name]: Number(event.target.value)}
    setNums({ ...nums, [event.target.name]: Number(event.target.value) })
    setSum( {...sum, clientSum: newValues.num1 + newValues.num2} )

  }

  function updateName(event) {

    const newValue = event.target.value
    setName(newValue)
  }

  function updateDesc(event) {

    const newValue = event.target.value
    setDesc(newValue)
  }

  async function add() {

    await axios.get(`http://ec2-100-26-53-219.compute-1.amazonaws.com:9000/add/${nums.num1}/and/${nums.num2}`)
      .then((response) => {
        setSum( {...sum, serverSum: response.data.addition} )
      });


  }

  return (
    <div className="Addition" id="main">

      <nav className="navbar" style={{ backgroundColor: "#f2f2f2" }}
        id="navbar">

        <div className="container-fluid">
          <a className="navbar-brand" href="!#">
            <img src="https://getbootstrap.com/docs/5.2/assets/brand/bootstrap-logo-shadow.png" alt="Bootstrap Logo" width="30" height="24" className="d-inline-block align-text-top"></img>
            Peters Cool Website
          </a>
        </div>
      </nav>


      <div id="mypanel">
        <div id="image">
          <img id="headshot" src="headshot.png" alt="Headshot">
          </img>
        </div>

        <div id="mydetails">
          <textarea id="myname" name="myname" defaultValue = {name} rows="1" cols="30" onChange = {updateName}/>

          <br />

          <textarea id="myinfo" name="myinfo" rows="4" cols="50"
            defaultValue = {desc} onChange = {updateDesc}
          />
        </div>
      </div>

      <div id="entry">
        <div>
          <span id="numberlabel" >First Number: </span>
          <div className="form-group" id="test">
            <input type="number" 
            className="form-control" 
            id="num1" 
            placeholder="First Number" 
            name="num1" 
            value={nums.num1} 
            onChange={updateNums} ></input>
          </div >
        </div>

        <br />

        <div>
          <span id="numberlabel" >Second Number: </span>
          <div className="form-group" id="test">
            <input type="number"
              className="form-control"
              id="num2"
              placeholder="Second Number"
              name = "num2"
              value = {nums.num2}
              onChange = {updateNums}>
            </input>
          </div>
        </div>
      </div>

      <br />
      <button type="button" className="btn btn-primary"
        style={{ margin: "10px" }} onClick={add}>Submit</button>

      <p style={{ padding: "10px" }}>Your Addition result from server = {sum.serverSum}
        <br />
        Your Addition result from ReactJS = {sum.clientSum}

      </p>


    </div>
  );
};

export default Addition;