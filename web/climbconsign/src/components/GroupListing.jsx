import React, {useState} from "react";

const GroupListing = props => {
    
    const [name, setName] = useState(props.group.name)
    const [rate, setRate] = useState(props.group.rate)

    
    // delete this group
    function deleteGroup()
    {
        props.delGroup(props.group)
    }

    // Updates the name of this group in the database
    function updateGroupName(event)
    {
        let newName = event.target.value
        setName(newName)
        // now we also need to make an async db call
    }

    // Updates the rate of this group in the database
    function updateGroupRate(event)
    {
        let newRate = event.target.value
        setRate(newRate)
    }

    if (props.group)
    {
        return( 
            <div id = "group-listing">
                <div className="form-group">
                    <label>Group Name</label>
                    <div id = "adjacent">
                        <input type="text" className="form-control" id="nameInput" value={name} onInput={updateGroupName} placeholder="Enter a name"></input>
                        <button type="button" className="btn btn-outline-danger" id = "del" onClick = {deleteGroup}>Delete</button>
                    </div>
                </div>
                
                <div className="form-group">
                    <label>Tax Rate</label>
                    <input type="numbr" className="form-control" id="nameInput" value={rate} onInput={updateGroupRate} placeholder="Enter a rate out of 100"></input>
                </div>
                <div id = 'del-group'>
                    
                </div>
                <br/>
                <hr class="solid"></hr>
            </div>
            
            )
    }
    
}

export default GroupListing;