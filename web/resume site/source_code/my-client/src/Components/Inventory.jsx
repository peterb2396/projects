
import axios from 'axios';
import FormData from 'form-data';
import React, { useState, useEffect} from "react";
import NavBar from './NavBar.jsx'
import ItemCard from './ItemCard.jsx'
import 'bootstrap/dist/css/bootstrap.css';

const Inventory = (props) => {

    const [items, setItems] = useState([]);
    //const host = "http://localhost:3001"
    const host = props.host
    //const host = "http://3.232.168.176:3001"

    const [curItem, setCurItem] = useState(items[0]);
    const [curPage, setCurPage] = useState("page-view");
    const [itemComponents, setItemComponents] = useState();
    const [filter, setFilter] = useState("");
    const [myid, setid] = useState("")
    const [op, setOp] = useState("")
    const [editor, setEditor] = useState("")
    const [first, setFirst] = useState(true)

    // Try to load the items on the first refresh
    if (first)
    {
        getItems()
        storeID()
        setFirst(false)
    }

    let dummy = new FormData();
    const [form, setForm] = useState(dummy)

    //store this user's id from their token
    // used to note them as the author when posting
    function storeID()
    {
        let data = {'username': props.token()}

        axios.post(`${host}/get-id`, data)
        .then(function (response) {
            setid(response.data.id) 
        })
    }

    //get the username of the creator of this item
    // also used to get the last editor
    // pass 0 if op, pass 1 if last editor
    const setName = React.useCallback(async (id, key) =>
    {
        let data = {'id': id}
        await axios.post(`${props.host}/get-name`, data)
        .then((response) =>{
            if (key === 0)
                setOp(response.data.username) //return the id to store as a token on the site?
            else
                setEditor(response.data.username)
        })
    }, [props.host])
    
    

    const showPage = React.useCallback((show) =>
    {
        // Hide the open page
        document.getElementById(curPage).style.display='none';
        
        // Show the desired page
        document.getElementById(show).style.display='block';

        setCurPage(show);


    }, [curPage])

    // We clicked on an item
    // store the details in form in case we hit update we can pass the data through
    // Hide the confirm button until a modification is made???
    const updateItem = React.useCallback((item) =>

    {
        
        // Store the OP and editor of this item
        setName(item.op, 0)
        setName(item.editor, 1)

        // We can delete , bc it does exist here!
        document.getElementById("delete-item").style.display = 'block';
        

        // We need to show the update page and display this item there
        showPage("page-update");

        let oldItem = Object.assign({}, item);
        setCurItem(oldItem) // A copy of the original item

        // Set the default data for if we confirm these changes
        form.set('qty', item.qty)
        form.set('op', item.op)
        form.set('editor', myid) //This will immediately become my id because i am the editor
        form.set('name', item.name)
        form.set('id', item.id)
        form.set('details', item.details)
        setForm(form)


        document.getElementById("nameInput").value = item.name;
        
        document.getElementById("qtyInput").value = item.qty;
    
        document.getElementById("imgInput").value = "";

        document.getElementById("details").value = item.details;

        // should we show confirm btn? make sure to call this AFTER changing the input fields!!
        validateConfirm()


    }, [showPage, form, setName, myid])

    // Refresh the view, does NOT update from DB! That occurs when we add, delete, modify or refresh.
    // here is where we display warning for no items if that is the case
    const refreshList = React.useCallback(() => {

        let comps = [];

        if (items.length === 0)
        {
            comps.push(<h2>No items in the inventory!</h2>)

        }
        
        
        else
        {

            // Add each element that matches the filter
        for (let i = 0; i < items.length; i++)
        {
            // If there's no filter or if this element satisfies the filter
            if (items[i].name.toLowerCase().indexOf(filter.toLowerCase()) > -1) 
            {
                comps.push(<ItemCard host = {host} item = {items[i]} edit = {updateItem} key={i} />)
            }
        }
        
        }
        setItemComponents(comps);
        
      
    }, [filter, items, updateItem, host])

    //ask the server to Get items from DB (reload)
    // ignore the last deleted id
    async function getItems(ignore)
    {
        await axios.get(`${host}/getAllItems`)
        .then((response) => {
            
            let newArray = []
            response.data.forEach((item, index) => 
            {
                if ((item._id !== ignore))
                    newArray.push({name: item.name, qty: item.qty, img: item.img, id: item._id, details: item.details, op: item.op, editor: item.editor, editdate: item.editdate, postdate: item.postdate})
                
            })
            setItems(newArray)// not doing anything?
            refreshList(); // Populate the list with our items array from DB
          })
        .catch((res) => {
            //console.log(res)
        })
    }
 
    
    // Refresh the list when our items change
    useEffect(() => {

        refreshList();
        
    },  [refreshList]);


    // Changing the filter changes the state
    // As a result, our onEffect hook is called
    // This will refresh the results based on the new filter since the hook calls the refresh.
    function updateFilter(event)
    {
        const newValue = event.target.value
        setFilter(newValue)
    }

    function validateConfirm()
    {
        // hide the error msg
        
        let name = document.getElementById("nameInput").value
        let qty = document.getElementById("qtyInput").value

        if (name && qty)
            document.getElementById("confirm-item").style.display = 'block';
        else
            document.getElementById("confirm-item").style.display = 'none';

    }

    function newItem()
    
    {
        
        // We cant delete , bc it doesnt exist yet!
        document.getElementById("delete-item").style.display = 'none';


        form.set('id', "none")
        form.set('op', myid) // Current logged in user is the OP
        form.set('name', "")
        form.set('qty', 0)
        form.set('details', "")
        setForm(form)

        showPage("page-update");
        let newItem = {name:"", qty:0, img:"", id: "none", details: "", op: props.token()}
        setCurItem(newItem) // A copy of the original item

        document.getElementById("nameInput").value = ""
        document.getElementById("qtyInput").value = ""
        document.getElementById("imgInput").value = ""
        document.getElementById("details").value = ""

        // Hide the confirm button
        validateConfirm()
    }

    // Item was saved. Called from EITHER newItem or updateItem!
    // Now we set the item at index to curItem which is a copy of what we want!
    function saveItem()
    {
       const newId = saveToDB(); // return the id and store it locally
       curItem.id = newId

       setCurItem(curItem)

       showPage("page-view");
        
    }

    

    // Save the current item to the database and return the unique id and then store it here so we can delete or modify it
    // either save it or add it - get current time
    async function saveToDB()
    {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        var date = mm + '/' + dd + '/' + yyyy;
        form.set('date', date)

        await axios.post(`${host}/addItem`, form,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authentication: 'Bearer ...',
            },
            })
        .then(function (response) {
        getItems();
        form.delete('image') // Remove the image reference once uploaded
        
        return response.data._id; //return the id to save locally
        })
        .catch(function (response) {
        //handle error
        console.log(response);
        });
        
        
        
    }

    // cancel item update (from navbar) go back without updating state
    function cancelUpdate()
    {
        showPage("page-view");
    }

    //Updated item name
    function updateItemName(event)
    {
        validateConfirm() // show or hide the confirm button

        if (event.target.value)
        {
            form.set('name', event.target.value)
            setForm(form)
   

            curItem.name = event.target.value;
            let newItem = Object.assign({}, curItem);
            setCurItem(newItem);
            
        }
    }

    //Updated item details 
    function updateItemDetails(event)
    {

        form.set('details', event.target.value)
        setForm(form)


        curItem.details = event.target.value;
        let newItem = Object.assign({}, curItem);
        setCurItem(newItem);
            
    }

    //Update item qty
    function updateItemQty(event)
    {
        
        // verify numerical
        validateConfirm()

        if (event.target.value)
        {
            form.set('qty', event.target.value)
            setForm(form)

            curItem.qty = event.target.value;
            let newItem = Object.assign({}, curItem);
            setCurItem(newItem);
        }
    }

    //Update item img
    // We need to handle the image file and turn it to form data to send over api
    // then we have to deconstruct on the other end (when displaying in icon!)
    function updateItemImg(event)
    {
        const input = document.getElementById("imgInput");
        const img = input.files[0];
        
        // Database image storage prep
        form.set('image', img, img.name)
        // set the previous image path so we can delete it
        form.set('prevImg', curItem.img)
        setForm(form)

        // Local image storage
        // image will point to local image until it gets stored on server at which point it will read from server
        let localsrc = URL.createObjectURL(img);
        curItem.img = localsrc;
        let newItem = Object.assign({}, curItem);
        setCurItem(newItem);
        

    }

    //Delete item
    async function deleteItem()
    {
        
        // Tell server to tell DB to remove this item (curItem)
        await axios.get(`${host}/delete/${curItem.id}`)
        .then((response) => {
            
            getItems(curItem.id);
            showPage("page-view");
          });
    }


    

    return (
    // MAIN VIEW PAGE

    
    <div id = "content-border">

        <div className="card border-secondary mb-3" id = "page-view">
            <div className="card-header"><NavBar token = {props.token} mode="0" newItem={newItem} updateFilter={updateFilter} showPage={showPage} refreshDB={getItems}></NavBar></div>
            <div className="card-body text-secondary"  id = "content">
                
                {itemComponents}

            </div>
        </div>

        
        <div className="card border-secondary mb-3" id = "page-update" >
            <div className="card-header"><NavBar token = {props.token} mode="1" cancelUpdate={cancelUpdate} refreshDB={getItems}></NavBar></div>
            <div className="card-body text-secondary"  id = "content">
                <div id = "currentItem">
                    <ItemCard host = {host} item = {curItem} id = "curItemPreview"/>
                </div>

                <div id = "form-entry">
                    <div id = "left-entry">
                        <form>
                            <div className="form-group">
                                <label >Name</label>
                                <input type="text" className="form-control" id="nameInput" onInput={updateItemName} placeholder="Enter a name!"></input>
                            </div>

                            <div className="form-group">
                                <label >Quantity</label>
                                <input type="number" className="form-control" id="qtyInput" onInput={updateItemQty} placeholder="Enter a quantity!" ></input>
                            </div>

                            <div className="form-group">
                                <label>Upload Image</label>
                                <input type="file" className="form-control" id="imgInput" name = "imgInput" accept=".png, .jpg, .jpeg" onInput={updateItemImg}/>
                            </div>

                            <div>
                                <label>{(curItem?.op && curItem?.id !== "none")? `Posted by ${op} on ${curItem.postdate}`: ``}</label><br/>
                                <label>{(curItem?.editor)? `Edited by ${editor} on ${curItem.editdate}`: ``}</label>
                            </div>
                            
                            <div className = "form-group" id = "modify-item-btns">
                                    <button type="button" className="btn btn-outline-danger" id = "delete-item" onClick = {deleteItem}>Delete </button>
                                    <button type="button" className="btn btn-outline-success" id = "confirm-item" onClick = {saveItem}>Confirm</button>
                                </div>
                                
                        </form>
                    </div>

                    <div className ="form-group" id = "desc">
                        <label>Details:</label>
                        <textarea className ="form-control" rows="10" cols="58" id="details" onInput={updateItemDetails}></textarea>
                    </div> 
                    
                </div>

                

            </div>
        </div>
    </div>
    
  

    )


}

export default Inventory;