import axios from 'axios';
import React, { useState} from "react";
import NavBar from './NavBar.jsx'

const Welcome = () => {

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

            <div className="card-header"><NavBar mode="3" ></NavBar></div>
                    <div className="card-body text-secondary"  id = "content">
                        <h2>Welcome to Peter's Projects!</h2>
                        <br/>
                        <p> Here you can navigate between my labs for ICSI 518.</p>
                        <p> Below we can see the third party api requirement.</p>
                        <br/>
                        <button className="btn btn-outline-primary" onClick={getJoke}>Tell me a joke</button>
                        <br/>
                        <pre id = "joke">{joke}</pre>
                    </div>
        </div>
    </div>

    )
}

export default Welcome;