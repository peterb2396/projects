//import React, { useState } from "react";
// Mode 0 is default (show search and add item)
// Mode 1 will show options to cancel an udate
// Mode 2 is for additions.
// Mode 3 is for welcome page
const NavBar = props => {

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


    //Navigating between pages
    function gotoAddition()
    {
        props.showPage("page-addition")
    }
    function gotoInventory()
    {
        refreshDB();
        props.showPage("page-view")
    }
    function gotoWelcome()
    {
        props.showPage("page-welcome")
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
                <img src="https://www.pngmart.com/files/8/List-PNG-Transparent-Picture.png" alt="Bootstrap Logo" width="30" height="24" className="d-inline-block align-text-top"></img>
                
                <div className="dropdown">
                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Inventory Database
                    </button>
                    <ul className="dropdown-menu">
                        <li><button className="btn btn-link" onClick = {gotoWelcome}>Welcome</button></li>
                        <li><button className="btn btn-link" onClick = {gotoAddition}>Addition</button></li>
                       
                    </ul>
                </div>
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
                <img src="https://www.pngmart.com/files/8/List-PNG-Transparent-Picture.png" alt="Bootstrap Logo" width="30" height="24" className="d-inline-block align-text-top"></img>
                Modifying Item
              </a>
            
            
            <div id = "new">
    
                <div id = "new2">
                <button className="btn btn-outline-danger" onClick = {callCancel}>Cancel </button>
                </div>
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
                    <img src="https://www.pngmart.com/files/8/List-PNG-Transparent-Picture.png" alt="Bootstrap Logo" width="30" height="24" className="d-inline-block align-text-top"></img>
                    
                    <div className="dropdown">
                        <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Addition
                        </button>
                        <ul className="dropdown-menu">
                            <li><button className="btn btn-link" onClick = {gotoWelcome}>Welcome</button></li>
                            <li><button className="btn btn-link" onClick = {gotoInventory}>Iventory</button></li>
                        
                        </ul>
                    </div>
                </div>
            
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
                <img src="https://www.pngmart.com/files/8/List-PNG-Transparent-Picture.png" alt="Bootstrap Logo" width="30" height="24" className="d-inline-block align-text-top"></img>
                
                <div className="dropdown">
                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Welcome!
                    </button>
                    <ul className="dropdown-menu">
                        <li><button className="btn btn-link" onClick = {gotoAddition}>Addition</button></li>
                        <li><button className="btn btn-link" onClick = {gotoInventory}>Iventory</button></li>
                    
                    </ul>
                </div>
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
//<button className="btn btn-outline-success" onClick={search}>Search</button>