import React, { useState } from "react";
// Mode 0 is default (show search and add item)
// Mode 1 will show options to cancel an udate
// Mode 2 is for additions.
const NavBar = props => {

    const [filter, setFilter] = useState("");


    function updateFilter(event)
    {
        const newValue = event.target.value
        setFilter(newValue)
    }

    //Go back to the main page
    function returnToList()
    {
        props.showPage("page-view")
    }

    //Clicked new item!
    function newItem()
    {
        props.newItem();
    }

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
                    <input class="form-control me-2" placeholder="Filter" onChange = {updateFilter}></input>
                    
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
                <button class="btn btn-outline-danger" onClick = {returnToList}>Cancel </button>
                </div>
            </div>
            
            </div>
        </nav>
    
        )
    }
    
}

export default NavBar;
//<button class="btn btn-outline-success" onClick={search}>Search</button>