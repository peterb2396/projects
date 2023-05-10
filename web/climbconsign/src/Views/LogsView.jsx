import React, { useState, useEffect} from "react";
import NavBar from '../components/NavBar.jsx'
import LogListing from "../components/LogListing.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.css';
import '../styles.css';
import axios from 'axios';

export default function LogsView(props) {

     
    // logs reflects our database. When it changes we refreshList() through the callback hook on this variable
    const fakeLogs = [
       {user: "Peter", action: "added", item: "Shoes (882716)", date: "3/02/22"},
       {user: "Josh", action: "sold", item: "Straps (227116)", date: "1/22/23"},
       {user: "Peter", action: "edited", item: "Gloves (381728)", date: "3/01/22"},
       {user: "Amit", action: "deleted", item: "Pants (918288)", date: "6/03/22"},
    ]
    const [logs, setLogs] = useState(fakeLogs);
    const [filter, setFilter] = useState("");
    const [loaded, setLoaded] = useState(false)
    const [logComponents, setLogComponents] = useState();


    const refreshList = React.useCallback(() => {

        let comps = [];

        if (logs.length === 0)
        {
            comps.push(<h2>No logs!</h2>)
        }
        
        else
        {
            // Add each element that matches the filter
        for (let i = 0; i < logs.length; i++)
        {
            
            // If there's no filter or if this element satisfies the filter
            if (logs[i].user.toLowerCase().indexOf(filter.toLowerCase()) > -1
            || logs[i].action.toLowerCase().indexOf(filter.toLowerCase()) > -1
            || logs[i].item.toLowerCase().indexOf(filter.toLowerCase()) > -1
            || logs[i].date.toLowerCase().indexOf(filter.toLowerCase()) > -1)
            {
                comps.push(<LogListing log = {logs[i]}/>)
            }
        }
        
        }
        setLogComponents(comps);
        
      
    }, [filter, logs])

    // First load
    if (!loaded)
    {
        setLoaded(true)
        getLogs()
    }

    function updateFilter(event)
    {
        const newValue = event.target.value
        setFilter(newValue)
    }

    // Refresh the list when our items change
    // or when the filter changes! when any state variable changes!
    useEffect(() => {

        refreshList();
        
    },  [refreshList]);
    
    //ask db to get all logs
    async function getLogs()
    {
        await axios.get(`${props.host}/getLogs`)
        .then((response) => {
            
            let newArray = []
            response.data.forEach((log, index) => 
            {
                newArray.push({user: log.user, action: log.action, item: log.item, date:log.date})
                
            })
            setLogs(newArray)// not doing anything?
            refreshList(); // Populate the list with our items array from DB
          })
        .catch((res) => {
            //console.log(res)
            // Not hooked up to DB
            refreshList();
        })
    }
    return (
    // MAIN VIEW PAGE
    <div id = "content-border">
        
        <div className="card border-secondary mb-3" id = "admin-logs">
            <div className="card-header"><NavBar mode="2" updateFilter = {updateFilter}></NavBar></div>
            <div className="card-body text-secondary"  id = "content">
                <div id = "item-container">
                    <div id = "detail-header">
                        <div id = "item-detail">User</div>
                        <div id = "item-detail">Action</div>
                        <div id = "item-detail">Item</div>
                        <div id = "item-detail">Date</div>
                    </div>

                    <div id = "logs">
                        {logComponents}
                    </div>
                </div>

            </div>
        </div>
        


    </div>
    
  

    )

}