//import React, { useState } from "react";
// Mode 0 is default (show search and add item)
// Mode 1 will show options to cancel an udate
// Mode 2 is for additions.
// Mode 3 is for welcome page
import { Link } from "react-router-dom";

const NavBar = props => {

    const noLoginDisplay = "(not logged in)"
    //Logout of account
    function logout()
    {
        props.logout()
    }

    //Call filter update in the main page thru the prop function
    function callFilterUpdate(event)
    {
        props.updateFilter(event);
    }


    //Clicked new item!
    function newItem()
    {
        props.newItem();
    }


    //Clicked cancel
    function callCancel()
    {
        props.cancelUpdate();
    }
    function refreshDB()
    {
        props.refreshDB();
    }

    
    switch(props.mode)
    {
        case "0"://Inventory navbar
    {
        return (
        
            <nav className="navbar"
            id="navbar">
    
            <div className="container-fluid">
                <div id = "left-nav">
                    <img src="listicon.png" alt="My Logo" width="30" height="24" className="d-inline-block align-text-top"></img>
                    
                        <div className="dropdown">
                            <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {`Inventory Database${props.token()? ` (${props.token()})`: ``}`}
                            </button>
                            <ul className="dropdown-menu">
                                <li><Link to = "/" key = "0">Welcome</Link></li>
                                <li><Link to = "/addition" key = "1">Addition</Link></li>
                                <li><Link to = {props.token()? "/account": "/login"} key = "1">{props.token()? "My Account": "Login"}</Link></li>
                            
                            </ul>
                        </div>
                    <p id = "usernameDisplay">{props.token()? "": noLoginDisplay}</p>

                </div>
            
            <div id = "new">
                <div id = "new1">
                <form className="d-flex" role="search">
                    <input className="form-control me-2" placeholder="Filter" onChange = {callFilterUpdate}></input>
                    
                </form>
                </div>
    
                <div id = "new-item">
                    <button className="btn btn-outline-success" onClick = {newItem}>New Item</button>
                </div>
                <div id = "refresh">
                    <button className="btn btn-outline-success" onClick = {refreshDB}>
                        <img width="20px" alt = "Submit" src = "refresh.png"></img>
                    </button>
                </div>
            </div>
            
            </div>
        </nav>
    
        )
    }

    case "1": //Modify or add item navbar
    {
        return (
        
            <nav className="navbar"
            id="navbar">
    
            <div className="container-fluid">
              <a className="navbar-brand" href="!#">
                <img src="listicon.png" alt="My Logo" width="30" height="24" className="d-inline-block align-text-top"></img>
                Modifying Item
              </a>
              
                <div id = "new2">
                    <p id = "usernameDisplay">{props.token()? props.token(): noLoginDisplay}</p>
                    <button className="btn btn-outline-danger" onClick = {callCancel}>Cancel </button>
                </div>
            
    
                
            
            </div>
        </nav>
    
        )
    }
    case "2": //Addition navbar
    {
        return (
        
            <nav className="navbar"
            id="navbar">
    
            <div className="container-fluid">
                <div id = "left-nav">
                    <img src="listicon.png" alt="My Logo" width="30" height="24" className="d-inline-block align-text-top"></img>
                    
                    <div className="dropdown">
                        <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {`Addition${props.token()? ` (${props.token()})`: ``}`}
                        </button>
                        <ul className="dropdown-menu">
                            <li><Link to = "/" key = "0">Welcome</Link></li>
                            <li><Link to = "/inventory" key = "1">Inventory</Link></li>
                            <li><Link to = {props.token()? "/account": "/login"} key = "1">{props.token()? "My Account": "Login"}</Link></li>
                        
                        </ul>
                    </div>
                </div>

                <p id = "usernameDisplay">{props.token()? "": noLoginDisplay}</p>
            
            </div>
        </nav>
    
        )
    }
    case "3": //Welcome page navbar
    return (
        
        <nav className="navbar"
        id="navbar">

        <div className="container-fluid">
            <div id = "left-nav">
                <img src="listicon.png" alt="My Logo" width="30" height="24" className="d-inline-block align-text-top"></img>
                
                <div className="dropdown">
                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {`Welcome${props.token()? `, ${props.token()}`: ``}`}
                    </button>
                    <ul className="dropdown-menu">
                        <li><Link to = "/inventory" key = "0">Inventory</Link></li>
                        <li><Link to = "/addition" key = "1">Addition</Link></li>
                        <li><Link to = {props.token()? "/account": "/login"} key = "1">{props.token()? "My Account": "Login"}</Link></li>
                    
                    </ul>
                </div>
            </div>

            <p id = "usernameDisplay">{props.token()? "": noLoginDisplay}</p>
        
        </div>
    </nav>

    )
    case "4": //Login navbar
    return (
        
        <nav className="navbar"
        id="navbar">

        <div className="container-fluid">
            <div id = "left-nav">
                <img src="listicon.png" alt="My Logo" width="30" height="24" className="d-inline-block align-text-top"></img>
                
                <div className="dropdown">
                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Login
                    </button>
                    <ul className="dropdown-menu">
                        <li><Link to = "/" key = "0">Welcome</Link></li>
                        <li><Link to = "/inventory" key = "0">Inventory</Link></li>
                        <li><Link to = "/addition" key = "1">Addition</Link></li>
                    
                    </ul>
                </div>
            </div>

            
        
        </div>
    </nav>

    )
    case "5": //Account navbar
    return (
        
        <nav className="navbar"
        id="navbar">

        <div className="container-fluid">
            <div id = "left-nav">
                <img src="listicon.png" alt="My Logo" width="30" height="24" className="d-inline-block align-text-top"></img>
                
                <div className="dropdown">
                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {`My Account (${props.token()? props.token(): noLoginDisplay})`}
                    </button>
                    <ul className="dropdown-menu">
                        <li><Link to = "/" key = "0">Welcome</Link></li>
                        <li><Link to = "/inventory" key = "0">Inventory</Link></li>
                        <li><Link to = "/addition" key = "1">Addition</Link></li>
                    
                    </ul>
                </div>
            </div>

            <div id = "new2">
                <button className="btn btn-outline-danger" onClick = {logout}>Logout</button>
            </div>
        
        </div>
    </nav>

    )

    default:
        {

        }
    }//end switch case
    
}

export default NavBar;