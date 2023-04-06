import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar.jsx'

import axios from 'axios';

export default function Login(props) {

    //const host = "http://localhost:3001"
    //const host = "http://3.232.168.176:3001"
    const host = props.host
    
    const AUTH_LOGIN = "Login"
    const AUTH_SIGNUP = "Sign up"

    const [authMode, setAuthMode] = useState(AUTH_LOGIN)
    const navigate = useNavigate();
    

    // auth mode change should verify data again


    

    function updatePassword()
    {
        validateData()
    }

    function updateUsername()
    {
        validateData()
        
    }


    function login()
    {
        // Fetch the data from frontend
        let username = document.getElementById("usernameInput").value
        let password = document.getElementById("passwordInput").value
        let data = {'username': username, 'password': password}

        axios.post(`${host}/login`, data)
          .then(function (response) {
            // check if valid
            console.log(response.data)
            if (response.data.authenticated)
            {
                error("success!")
                props.setToken(response.data.username)
                navigate('/');
            }
            else{
                error("Invalid password!")
            }
            return response.data._id; //return the id to store as a token on the site?
          })
          .catch(function (response) {
            //handle error
            console.log(response);
          });

    }

    // Add these credentials to the databse.
    async function signup()
    {
        // Fetch the data from frontend
        let username = document.getElementById("usernameInput").value
        let password = document.getElementById("passwordInput").value

        let data = {'username': username, 'password': password}

        await axios.post(`${host}/signup`, data)
          .then(function (response) {
            props.setToken(response.data.username)
            // After signing up we log in (set the token) and navigate back to the home page
            navigate('/');
          })
          .catch(function (response) {
            //handle error
            console.log(response);
          });
    }

    // display this error
    function error(err)
    {
        document.getElementById("errorMsg").style.display = "flex"
        document.getElementById("errorMsg").innerHTML = err
    }

    // Return true if this username is taken
    function validateData()

    {
        let valid = true
        // return false if no password is present
        if (! document.getElementById("passwordInput").value || ! document.getElementById("usernameInput").value)
            valid = false

        if (valid) // entries are syntactically good...
        {
            // Now, we must check and make sure the username is available
            let username = document.getElementById("usernameInput").value
            let data = {'username': username}
            // we need to check the database for this username
            axios.post(`${host}/getUser`, data)
            .then(function (response) {
                
                if (!response.data["exists"]) // Username available! Good to go.
                {
                    document.getElementById('login-btn').disabled = authMode === AUTH_SIGNUP ? false : true;
                    if (authMode === AUTH_LOGIN)
                    {
                        error("no account found!")
                    }
                    else
                    {
                        document.getElementById("errorMsg").style.display = "none"
                    }
                      
                }
                else
                {
                    document.getElementById('login-btn').disabled = authMode === AUTH_LOGIN ? false : true;
                    if (authMode === AUTH_SIGNUP)
                    {
                        error("username taken!")
                    }
                    else{
                        document.getElementById("errorMsg").style.display = "none"
                    }
                }

                
            })
        }
        else // Syntax is bad, user or pass is empty
        {
            document.getElementById("errorMsg").style.display = "none"
            document.getElementById('login-btn').disabled = true;
        }
        
    }

    // Click to toggle between login and sign up.
    function toggleLoginSignup()
    {
        setAuthMode((authMode === AUTH_LOGIN)? AUTH_SIGNUP : AUTH_LOGIN)
        document.getElementById("usernameInput").value = ""
        document.getElementById("passwordInput").value = ""
        validateData()
        
    }
    
    
  return(

    <div id = "content-border">
        <div className="card border-secondary mb-3">

            <div className="card-header"><NavBar token = {props.token} mode="4" ></NavBar></div>
                    <div className="card-body text-secondary"  id = "content">
                        <div id = "login-wrap">
                            <div className="login-wrapper" id = "login">
                                <h1 id = "authModeHeader">{authMode}</h1>
                                    <form>
                                        <div className="form-group">
                                            <label >Username</label>
                                            <input type="text" className="form-control" id="usernameInput" onInput={updateUsername} placeholder="Enter username"></input>
                                        </div>

                                        <div className="form-group">
                                            <label >Password</label>
                                            <input type="password" className="form-control" id="passwordInput" onInput={updatePassword} placeholder="Enter password"></input>
                                        </div>

                                        <p id = "errorMsg">Error msg</p>

                                        <div id = "login-btn-div">
                                            <button type="button" className="btn btn-outline-primary" id = "login-btn" onClick = {authMode === AUTH_LOGIN ? login : signup}>{authMode}</button>
                                            <div id = "toggle-authmode">
                                                <span>Or</span>
                                                <button type="button" id = "toggle-authmode-btn" onClick = {toggleLoginSignup}>{(authMode === AUTH_LOGIN ? AUTH_SIGNUP: AUTH_LOGIN).toLowerCase()}</button>
                                                <span>instead</span>
                                            </div>
                                            
                                        </div>
                                    </form>
                            </div>
                        </div>
            </div>
        </div>
    </div>

   
  )
}