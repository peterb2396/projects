import React, { useState, useEffect } from "react";
import NavBar from './Components/NavBar.jsx'
import NewItem from './Components/NewItem.jsx'
import ItemCard from './Components/ItemCard.jsx'
import 'bootstrap/dist/css/bootstrap.css';
import './styles.css';

const Main = () => {

    useEffect(() => {    
        refreshList();
    });
    


    const [items, setItems] = useState(
    [
        {name:"Milo", qty:4, img: "http://clipart-library.com/img/1678242.png", index: 0},
        {name:"Luna", qty:2, img: "http://clipart-library.com/img/1678251.png", index: 1},
        {name:"Fin", qty:8, img: "http://clipart-library.com/img/1678368.png", index: 2},
    ]);

    const [curItem, setCurItem] = useState(items[0]);
    const [curPage, setCurPage] = useState("page-view");
    const [itemComponents, setItemComponents] = useState();
    const [filter, setFilter] = useState("");
    const [validName, setValidName] = useState(true);
    const [validQty, setValidQty] = useState(true);



    // Changing the filter changes the state
    // As a result, our onEffect hook is called
    // This will refresh the results based on the new filter since the hook calls the refresh.
    function updateFilter(event)
    {
        const newValue = event.target.value
        setFilter(newValue)
    }

    
    function showPage(show)
    {
        // Hide the open page
        document.getElementById(curPage).style.display='none';

        // Show the desired page
        document.getElementById(show).style.display='block';

        setCurPage(show);

    }

    // We clicked on an item
    function updateItem(item)
    {
        // We need to show the update page and display this item there
        showPage("page-update");
        let oldItem = Object.assign({}, item);
        setCurItem(oldItem) // A copy of the original item

        document.getElementById("nameInput").value = item.name
        document.getElementById("qtyInput").value = item.qty


    }

    // Refresh the view from database (or dummy)
    function refreshList()
    {
        // Will reflect whatever is in our item array
        // When do we set the array to the database content?
        // Maybe i should do it here too since this function runs on the effect hook?
       
        
        let comps = [];
        // Add each element that matches the filter
        for (let i = 0; i < items.length; i++)
        {

            // Set the index of each item! Useful for deletions and modifications!
            items[i].index = i;

            // If there's no filter or if this element satisfies the filter
            if (items[i].name.toLowerCase().indexOf(filter.toLowerCase()) > -1) 
            {
                comps.push(<ItemCard item = {items[i]} edit = {updateItem} key={i} />)
            }
        }

        setItems(items); // Saves the re-indexing incase there was a deletion
        setItemComponents(comps);
      
    }

    // Add a new item: Show the new item page with a new blank item ref that will reflect updates (useState)
    // use curItem for this? probably!
    function newItem()
    {
        
    }

    // Item was saved. Called from EITHER newItem or updateItem!
    // Now we set the item at index to curItem which is a copy of what we want!
    function saveItem()
    {
        // Use state to update our array with the new item, curItem, which is a modified copy of the original.
       items[curItem.index] = curItem;
       setItems(items);

       showPage("page-view");
       
        
    }

    // cancel item update (from navbar) go back without updating state
    function cancelUpdate()
    {
        
        showPage("page-view");
    }

    //Updated item details
    function updateItemName(event)
    {
        
        if (event.target.value)
        {
            setValidName(true);
            curItem.name = event.target.value;
            if (validQty)
            {
                document.getElementById("confirm-item").style.display = "block";
            }
            
        }
        else 
        {
            setValidName(false);
            document.getElementById("confirm-item").style.display = 'none';
        
        }
    }

    //Update item qty
    function updateItemQty(event)
    {
        
        // verify numerical
        if (event.target.value)
        {
            setValidQty(true);
            curItem.qty = event.target.value;
            if (validName)
            {
                document.getElementById("confirm-item").style.display = "block";
            }
        }
        else 
        {
            setValidQty(false);
            document.getElementById("confirm-item").style.display = 'none';
        
        }
    }

    //Delete item
    function deleteItem()
    {
        // Tell DB to remove this item (curItem)
        // For now I will copy the array without it and set it with state

        const before = items.slice(0, curItem.index);
        const after = items.slice(curItem.index + 1);
        
        setItems( before.concat(after) );

        showPage("page-view");
        // This should call refresh, because state has changed (items), so refresh will then update item indeces!
        // This resolves gaps. (i.e. deleting index 1 previously left [0, 2] now 2 gets re indexed to 1.)
    }
    

    return (
    // MAIN VIEW PAGE
    <div id = "content-border">
        <div class="card border-secondary mb-3" id = "page-view">
                    <div class="card-header"><NavBar mode="0" newItem={newItem} updateFilter={updateFilter}></NavBar></div>
                    <div class="card-body text-secondary"  id = "content">
                        
                        {itemComponents}

                    </div>
        </div>

        
        <div class="card border-secondary mb-3" id = "page-update" >
                    <div class="card-header"><NavBar mode="1" showPage={showPage} cancelUpdate={cancelUpdate}></NavBar></div>
                    <div class="card-body text-secondary"  id = "content">
                        <div id = "currentItem">
                            <ItemCard item = {curItem} id = "curItemPreview"/>
                        </div>

                        <div id = "form-entry">
                            <form>
                                <div class="form-group">
                                    <label for="nameInput">Name</label>
                                    <input type="text" class="form-control" id="nameInput" onInput={updateItemName} placeholder="Enter a name!"></input>
                                </div>

                                <div class="form-group">
                                    <label for="qtyInput">Quantity</label>
                                    <input type="number" class="form-control" id="qtyInput" onInput={updateItemQty} placeholder="Enter a quantity!" ></input>
                                </div>

                                
                                    <div class = "form-group" id = "modify-item-btns">
                                        <button type="button" class="btn btn-outline-danger" id = "delete-item" onClick = {deleteItem}>Delete </button>
                                        <button type="button" class="btn btn-outline-success" id = "confirm-item" onClick = {saveItem}>Confirm</button>
                                    </div>

                    
                            </form>
                        </div>

                    </div>
        </div>
    </div>
    
  

    )

}

export default Main;