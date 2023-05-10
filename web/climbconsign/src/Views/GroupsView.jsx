import React, { useState, useEffect} from "react";
import NavBar from '../components/NavBar.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.css';
import '../styles.css';
import axios from 'axios';
import GroupListing from "../components/GroupListing.jsx";


export default function GroupsView(props) {

     
    // items reflects our database. When it changes we refreshList() through the callback hook on this variable
    const fakeGroups = [
        {name: "Clothing", rate: 7},
        {name: "Equipment", rate: 11},
        {name: "Books", rate: 4},
    ]

    // to display the list, we display all names from the db, which will be each VALUE in our map.

    const [groupComponents, setGroupComponents] = useState(); // We need a component built for each group in the array (if offline)
    const [groups, setGroups] = useState(fakeGroups);
    const [loaded, setLoaded] = useState(false)


     //delete this group
    const delGroup = React.useCallback((group) =>
    {
        let index = -1
        for (let i = 0; i < groups.length; i++)
        {
            // get the index
            if (groups[i] === group)
            {
                index = i
                break
            }
        }
        if (index !== -1)
        {
            let newArray = groups
            //found the group, remove it
            newArray.splice(index, 1)
            setGroups(newArray)

            let comps = []
            setGroupComponents(comps)

        if (groups.length === 0)
        {
            comps.push(<h2>No groups!</h2>)
        }
        
        else
        {
            // Add each element that matches the filter
        for (let g of groups)
        {
            console.log(g.name)
            comps.push(<GroupListing group = {g} delGroup= {delGroup}/>)
        }
        
        }
        setGroupComponents(comps);
        }
    }, [groups])

    const refreshList = React.useCallback(() => {

        let comps = [];

        if (groups.length === 0)
        {
            comps.push(<h2>No groups!</h2>)
        }
        
        else
        {
            // Add each element that matches the filter
        for (let i = 0; i < groups.length; i++)
        {
            comps.push(<GroupListing group = {groups[i]} delGroup= {delGroup}/>)
        }
        
        }
        setGroupComponents(comps);

        //scroll to bottom
        
      
    }, [groups, delGroup])

   

    

    // First load
    if (!loaded)
    {
        setLoaded(true)
        getGroups() //from db
    }

    //Make a new group
    function newGroup()
    {
       let newGroups = groups.concat({name: "New Group", rate: 0})
       setGroups(newGroups)
       
    }

    

    useEffect(() =>
    {
        refreshList() //when our groups change (add or delete) refresh to show it and scroll to end
        document.getElementById('items').scrollTop = document.getElementById('items').scrollHeight

    },[groups, refreshList])
    //ask db to get all groups
    async function getGroups()
    {
        await axios.get(`${props.host}/getGroups`)
        .then((response) => {
            
            let newArray = []
            response.data.forEach((group, index) => 
            {
                newArray.push({name: group.name, rate: group.rate})
                
            })
            setGroups(newArray)// not doing anything?
            
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
            <div className="card-header"><NavBar mode="3" newGroup={newGroup}></NavBar></div>
            <div className="card-body text-secondary"  id = "content">
                <div id = "item-container">

                    <div id = "items">
                        {groupComponents}
                    </div>
                    <div id ="group-btns">

                    </div>
                </div>

            </div>
        </div>
        


    </div>
    
  

    )

}