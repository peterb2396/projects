//import React, { useState } from "react";
// Mode 0 is default (show search and add item)
// Mode 1 will show options to cancel an udate
// Mode 2 is for additions.
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

    //Clicked cancel
    function callCancel()
    {
        props.cancelUpdate();
    }

    //Main page navbar, allow add item, filter
    if (props.mode === "0")
    {
        return (
        
            <nav className="navbar"
            id="navbar">
    
            <div className="container-fluid">
              <a className="navbar-brand" href="!#">
                <img src="https://www.pngmart.com/files/8/List-PNG-Transparent-Picture.png" alt="Bootstrap Logo" width="30" height="24" className="d-inline-block align-text-top"></img>
                Inventory View
              </a>
            
            
            <div id = "new">
                <div id = "new1">
                <form class="d-flex" role="search">
                    <input class="form-control me-2" placeholder="Filter" onChange = {callFilterUpdate}></input>
                    
                </form>
                </div>
    
                <div id = "new2">
                <button class="btn btn-outline-success" onClick = {newItem}>New Item</button>
                </div>
            </div>
            
            </div>
        </nav>
    
        )
    }
    else{
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
                <button class="btn btn-outline-danger" onClick = {callCancel}>Cancel </button>
                </div>
            </div>
            
            </div>
        </nav>
    
        )
    }
    
}

export default NavBar;
//<button class="btn btn-outline-success" onClick={search}>Search</button>