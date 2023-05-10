import { Link } from "react-router-dom";
const NavBar = props => {

    //Call filter update in the main page thru the prop function
    function callFilterUpdate(event)
    {
        props.updateFilter(event);
    }

    //make a new group
    function newGroup()
    {
        props.newGroup()
    }

    //Logout button
    function logout()
    {
        sessionStorage.clear()
        window.location.reload()
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
                <img src="listicon.png" alt="CC" width="30" height="24" className="d-inline-block align-text-top"></img>
                
                <div className="dropdown">
                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Consignment Items
                    </button>
                    <ul className="dropdown-menu">
                        <li><Link to = "/admin/logs" key = "0">Admin Logs</Link></li>
                       <button class="link" type = "button" id = "plain-btn" onClick={logout}>Logout</button>
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
                    <button className="btn btn-outline-primary" onClick = {newItem}>New Item</button>
                </div>
                <div id = "refresh">
                    <button className="btn btn-outline-primary" onClick = {refreshDB}>
                        <img width="20px" alt = "Refresh" src = "refresh.png"></img>
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
                <img src="listicon.png" alt="CC" width="30" height="24" className="d-inline-block align-text-top"></img>
                Modifying Item
              </a>
            
            
            <div id = "new">
    
                <div id = "new2">
                <button className="btn btn-outline-primary" onClick = {callCancel}>Cancel </button>
                </div>
            </div>
            
            </div>
        </nav>
    
        )
    }

    case "2": //Admin menu - logs
    {
        return (
        
            <nav className="navbar"
            id="navbar">
    
            <div className="container-fluid">
                <div id = "left-nav">
                <img src="listicon.png" alt="CC" width="30" height="24" className="d-inline-block align-text-top"></img>
                
                <div className="dropdown">
                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Action Logs
                    </button>
                    <ul className="dropdown-menu">
                        <li><Link to = "/" key = "0">Consignment Items</Link></li>
                        <button type = "button" class="link" id = "plain-btn" onClick={logout}>Logout</button>
                    </ul>
                </div>

                <div id = "log-filter">
                    <form className="d-flex" role="search">
                        <input className="form-control me-2" placeholder="Filter" onChange = {callFilterUpdate}></input>
                    </form>
                </div>
                
                </div>
{/*             
            <div id = "new">
                
                <div id = "new1">
                    <li><Link to = "/admin/groups" key = "0">Tax Groups</Link></li>
                </div>

            </div> */}
            
            </div>
        </nav>
    
        )
    }
    case "3": //Admin menu - groups
    {
        return (
        
            <nav className="navbar"
            id="navbar">
    
            <div className="container-fluid">
                <div id = "left-nav">
                <img src="listicon.png" alt="CC" width="30" height="24" className="d-inline-block align-text-top"></img>
                
                <div className="dropdown">
                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Tax Groups
                    </button>
                    <ul className="dropdown-menu">
                        <li><Link to = "/" key = "0">Consignment Items</Link></li>
                        <button type = "button" class="link" id = "plain-btn" onClick={logout}>Logout</button>
                       
                    </ul>
                </div>
                <div style={{ paddingLeft: `10px`, display: `inline-block`}}>
                    <button className="btn btn-outline-primary" onClick = {newGroup}>New Group </button>
                </div>
                </div>
            
            <div id = "new">
                <div id = "new1">
                    <li><Link to = "/admin/logs" key = "0">Action Logs</Link></li>
                </div>

            </div>
            
            </div>
        </nav>
    
        )
    }
    
    default:
        {

        }
    }//end switch case
    
}

export default NavBar;