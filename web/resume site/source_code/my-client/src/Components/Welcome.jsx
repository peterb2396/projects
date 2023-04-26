import axios from 'axios';
import React, { useState} from "react";
import NavBar from './NavBar.jsx'

const Welcome = (props) => {

    const [joke, setJoke] = useState("")
    //get joke from Joke API
    async function getJoke()
    {
        await axios.get('https://v2.jokeapi.dev/joke/Programming,Pun?blacklistFlags=nsfw,religious,racist&format=txt')
        .then((response) => {
            setJoke(response.data)
        })
    }

    return(
    <div id = "content-border">
        <div className="card border-secondary mb-3">

            <div className="card-header"><NavBar token = {props.token} mode="3" ></NavBar></div>
                <div className="card-body text-secondary"  id = "content">
                    {/*Detail Card*/}
                    <div>
                        <div className="card border-secondary mb-3" id = "profile-card"> 

                            <div className="card-header" >
                            <div id="image">
                                <img id="headshot" src="headshot.png" alt="Headshot"></img>
                            </div >
                                <p id = "myname">Peter Buonaiuto</p>
                                
                            </div>
                                <div className="card-body text-secondary" >
                                    Hello, World! I'm a Master's student with experience in web devlopment (MERN), game development, and data analytics.
                                    <br/>
                                    <br/>
                                    In general, I love writing programs to solve problems. Especially when it involves writing algorithms!
                                    <img width = "270" alt = "top langs"src = "https://github-readme-stats-git-masterrstaa-rickstaa.vercel.app/api/top-langs/?username=peterb2396&theme=vue&layout=compact"></img>
                                </div>
                            </div>
                        <div/>
                    </div>
                    <div id = "joke-div">
                        <button className="btn btn-outline-primary" onClick={getJoke}>Tell me a joke</button>
                        <br/>
                        <pre id = "joke">{joke}</pre>
                    </div>

                    
                </div>
        </div>
    </div>

    )
}

export default Welcome;