import React, { useState } from "react";
import axios from 'axios';
import NavBar from './NavBar.jsx'
import 'bootstrap/dist/css/bootstrap.css';


// ADDITION COMPONENT (PAGE)
const Addition = () => {
  //const host = "http://3.232.168.176:3001"
  const host = "http://localhost:3001"

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
    await axios.get(`${host}/add/${nums.num1}/and/${nums.num2}`)
      .then((response) => {
        setSum( {...sum, serverSum: response.data.addition} )
      });


  }

  return (
    <div id = "content-border">
    <div className="card border-secondary mb-3" >
            <div className="card-header"><NavBar mode="2" ></NavBar></div>
                <div className="card-body text-secondary"  id = "content">
                <div className="Addition" id="main">

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
                </div>


        </div>

</div>

    
  );
};

export default Addition;