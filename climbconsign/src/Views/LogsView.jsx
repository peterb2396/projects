import React, { useState, useEffect} from "react";
import NavBar from '../components/NavBar.jsx'
import LogListing from "../components/LogListing.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.css';
import '../styles.css';
import axios from 'axios';

export default function LogsView(props) {

     
    const [logs, setLogs] = useState([]);
    const [filter, setFilter] = useState("");
    const [loaded, setLoaded] = useState(false)
    const [logComponents, setLogComponents] = useState();


    const refreshList = React.useCallback(() => {

        let comps = [];

        if (logs.length === 0)
        {
            comps.push(<h2>No logs!</h2>)
        }
        
        
        else // we have logs! Sort them, then display them with a component for each.
        {

            const sorted_logs = logs.sort((a, b) => b.rawdate - a.rawdate);
            setLogs(sorted_logs)



            // Add each element that matches the filter
            for (let i = 0; i < logs.length; i++)
            {
                
                // If there's no filter or if this element satisfies the filter
                if (logs[i].action?.toLowerCase().indexOf(filter.toLowerCase()) > -1
                || logs[i].item?.toLowerCase().indexOf(filter.toLowerCase()) > -1
                || logs[i].value?.toLowerCase().indexOf(filter.toLowerCase()) > -1
                || logs[i].datetime?.toLowerCase().indexOf(filter.toLowerCase()) > -1)
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
    
    //ask db to get all logs (call db for items)
    async function getLogs()
    {
        await axios.get(`${props.host}/items`)
        .then((response) => {
            
            let newArray = []

            // for each item...
            response.data.forEach((item, index) => 
            {
                let logs 
                try {
                    logs = JSON.parse(item['EXTENDED_JSON']['logs'])
                } catch (error) {
                    logs = item['EXTENDED_JSON']['logs']
                }

                let transactions
                try {
                    transactions =JSON.parse(item['EXTENDED_JSON']['transactions'])
                } catch (error) {
                    transactions = item['EXTENDED_JSON']['transactions']
                }

                let item_name = item['EXTENDED_JSON']['name']
                let item_id = item['PRODUCT_ID']
                let item_display = `${item_id} (${item_name})`

                // for each log
                for (let index in logs)
                {
                    let log = logs[index]
                    
                    //ignore changes where all items changed - TEMPORARY because we get a big change log on creation for bad reasons (fixme)
                    if (log['changes'].length > 4)
                        continue

                    
                    // =========== Create a log for EACH unique change =============
                    //console.log(log)

                    for (let index in log['changes'])
                    {
                        let change = log['changes'][index]

                        // ignore this change, it's a duplicate of a name edit
                        if (change['key'] === "DESCRIPTION")
                            continue

                        // ignore changes where the old value is the parsed equivalent of the new value (temporary fix, array will FLOOD! @Amit)
                        if (change['key'] === "RETAIL_PRICE" && parseInt(change['old']) === parseInt(change['new']))
                            continue

                        // Set fallback action
                        let action = log['action'] + " "+ change['key']

                        // Set standard action names
                        if (change['key'] === "RETAIL_PRICE")
                            action = "updated price"
                        
                        if (change['key'] === "color_desc")
                            action = "updated color"

                        if (change['key'] === "size_desc")
                            action = "updated size"

                        newArray.push({item: item_display, action: action, datetime: log['datetime'], rawdate: log['rawdate'], staff: log['staff_id'], value: `${change['old']} --> ${change['new']}`})
            
                    }
                        
                    
                        
                }
                    

                // for each transaction (list, cashout)
                
                if (transactions["listed"]["datetime"])
                    newArray.push({item: item_display,action: "Listed", datetime: transactions["listed"]["datetime"], rawdate: transactions["listed"]["rawdate"], staff: transactions["listed"]["staff_id"], value: ""})

                if (transactions["sold"]["datetime"])
                    newArray.push({item: item_display,action: "Sold", datetime: transactions["sold"]["datetime"], rawdate: transactions["listed"]["rawdate"], staff: transactions["sold"]["staff_id"], value: transactions["sold"]["invoice_id"]})
                
                if (transactions["payout"]["datetime"])
                    newArray.push({item: item_display, action: "Payout", datetime: transactions["payout"]["datetime"], rawdate: transactions["listed"]["rawdate"], staff: transactions["payout"]["staff_id"], value: transactions["payout"]["amount"]})
                
                
            })
            setLogs(newArray)// not doing anything?
            refreshList(); // Populate the list with our items array from DB
          })
        .catch((res) => {
            console.log(res)
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
                        <div id = "item-detail">Staff</div>
                        <div id = "item-detail">Action</div>
                        <div id = "item-detail">Item</div>
                        <div id = "item-detail">Value</div>
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