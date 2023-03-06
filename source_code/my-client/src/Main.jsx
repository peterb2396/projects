import React, { useState, useEffect} from "react";
import NavBar from './Components/NavBar.jsx'
import ItemCard from './Components/ItemCard.jsx'
import Addition from "./Components/Addition.jsx";
import 'bootstrap/dist/css/bootstrap.css';
import './styles.css';
import axios from 'axios';
import FormData from 'form-data';


const Main = () => {
    
     
    // items reflects our database. When it changes we refreshList() through the callback hook on this variable
    const [items, setItems] = useState([]);

    const [curItem, setCurItem] = useState(items[0]);
    const [curPage, setCurPage] = useState("page-welcome");
    const [itemComponents, setItemComponents] = useState();
    const [filter, setFilter] = useState("");
    const [validName, setValidName] = useState(true);
    const [validQty, setValidQty] = useState(true);

    //const [imgData, setimgData] = useState({});
    //let form;
    let dummy = new FormData();
    const [form, setForm] = useState(dummy)
    

    



    const showPage = React.useCallback((show) =>
    {
        // Hide the open page
        document.getElementById(curPage).style.display='none';
        
        // Show the desired page
        document.getElementById(show).style.display='block';

        setCurPage(show);


    }, [curPage])

    // We clicked on an item
    const updateItem = React.useCallback((item) =>

    {

        // We need to show the update page and display this item there
        showPage("page-update");

        let oldItem = Object.assign({}, item);
        setCurItem(oldItem) // A copy of the original item


        document.getElementById("nameInput").value = item.name;
        
        document.getElementById("qtyInput").value = item.qty;
    
        document.getElementById("imgInput").value = item.img;


    }, [showPage])

    // Refresh the view, does NOT update from DB! That occurs when we add, delete, modify or refresh.
    const refreshList = React.useCallback(() => {

        // Create array from the DB
        
        let comps = [];

        // Add each element that matches the filter
        for (let i = 0; i < items.length; i++)
        {

            // Set the index of each item! Useful for deletions and modifications!
            //items[i].index = i;

            // If there's no filter or if this element satisfies the filter
            if (items[i].name.toLowerCase().indexOf(filter.toLowerCase()) > -1) 
            {
                comps.push(<ItemCard item = {items[i]} edit = {updateItem} key={i} />)
            }
        }
        
        // setItems(items); // Saves the re-indexing incase there was a deletion
        setItemComponents(comps);
        
      
    }, [filter, items, updateItem])

    //ask the server to Get items from DB (reload)
    async function getItems()
    {
        await axios.get(`http://localhost:9000/getAllItems`)
        .then((response) => {
            
            let newArray = []
            //console.log(response.data)
            response.data.forEach((item, index) => 
            {
                if (!newArray.includes({name: item.name, qty: item.qty, img: item.img, id: item._id}))
                {
                    newArray.push({name: item.name, qty: item.qty, img: item.img, id: item._id})
                }
            })
            setItems(newArray)// not doing anything?
            refreshList(); // Populate the list with our items array from DB
          });
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

    function newItem()
    
    {
        // We need to show the update page and display this item there
        // We display a new item with the next index
        // We know that this is a "new item" for the html because index === items.length

        showPage("page-update");
        let newItem = {name:"", qty:0, img:"https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg", id: "none" }
        setCurItem(newItem) // A copy of the original item

        document.getElementById("nameInput").value = ""
        document.getElementById("qtyInput").value = ""
        document.getElementById("imgInput").value = ""
    }

    // Item was saved. Called from EITHER newItem or updateItem!
    // Now we set the item at index to curItem which is a copy of what we want!
    function saveItem()
    {
       
       const newId = saveToDB(); // return the id and store it locally
       curItem.id = newId

       setCurItem(curItem)

       showPage("page-view");
       //getItems(); //load new values
      
        
    }

    // Save the current item to the database and return the unique id and then store it here so we can delete or modify it
    // either save it or add it
    async function saveToDB()
    {
        //console.log(form)
            await axios.post(`http://localhost:9000/addItem/${curItem.name}/${curItem.qty}/${curItem.id}`,
            form,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                  Authentication: 'Bearer ...',
                },
              })
            

          .then(function (response) {
            //handle success, return id so i need to add the id to the response json on server
            //console.log(response);
            //console.log(response.data)
            getItems();
            
            return response.data._id;
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

    //Updated item details
    function updateItemName(event)
    {
        
        if (event.target.value)
        {
            setValidName(true);

   

            curItem.name = event.target.value;
            let newItem = Object.assign({}, curItem);
            setCurItem(newItem);
            
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
            let newItem = Object.assign({}, curItem);
            setCurItem(newItem);

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

    //Update item img
    // We need to handle the image file and turn it to form data to send over api
    // then we have to deconstruct on the other end (when displaying in icon!)
    function updateItemImg(event)
    {
        const input = document.getElementById("imgInput");
        const img = input.files[0];

        
        // trying again with form!
         //make a new form object to send because we are picking a new image?
        // problem is, if i go to update and dont change the image, i have no payload to send, or itll be empty
        // so i need to fill it with the current image (this stuff below!) not here, but on submit.
        // if we arent changing the image, we still must have this payload stored in the item database
        // which of course it will be. So with that said, since its in the DB it will be in the curItem and we 
        // can just send through curItem.imgdata ...
        form.append('image', img, img.name)

        setForm(form)

        //var reader = new FileReader();
        //reader.onloadend = function() {
            // Called when we read image
            //console.log('RESULT', reader.result)
            //imgData['name'] = reader.result.substring(reader.result.indexOf("base64,") + 7) //store it
            //imgData['name'] = encodeURIComponent(reader.result.substring(50));
            //imgData['type'] = reader.result.substring( reader.result.indexOf(""))
            //setimgData(imgData);
        //  }



        //reader.readAsDataURL(img);

        // imgData is used for databse. The rest is used for local preview!
        


        // Display src as the image, but upload imgData to the DB for storage
        let src = URL.createObjectURL(img);
        //imgData['name'] = src; // i was doing this when trying to pass as a string, base64 for example but failed.
        //setimgData(imgData)
  
        curItem.img = src;
        let newItem = Object.assign({}, curItem);
        setCurItem(newItem);
        

    }

    //Delete item
    async function deleteItem()
    {
        
        // Tell server to tell DB to remove this item (curItem)
        await axios.get(`http://localhost:9000/delete/${curItem.id}`)
        .then((response) => {
            
            getItems();
            showPage("page-view");
          });

        // For now I will copy the array without it and set it with state

        //const before = items.slice(0, curItem.index);
        //const after = items.slice(curItem.index + 1);
        
        // Will call refresh because refresh uses callback hook that depends on items!!!!!!!!!!
        //setItems( before.concat(after) );

        //showPage("page-view");
        //getItems(); // reload from DB?
        // This should call refresh, because state has changed (items), so refresh will then update item indeces!
        // This resolves gaps. (i.e. deleting index 1 previously left [0, 2] now 2 gets re indexed to 1.)
    }

    return (
    // MAIN VIEW PAGE
    <div id = "content-border">
        <div class="card border-secondary mb-3" id = "page-view">
            <div class="card-header"><NavBar mode="0" newItem={newItem} updateFilter={updateFilter} showPage={showPage} refreshDB={getItems}></NavBar></div>
            <div class="card-body text-secondary"  id = "content">
                
                {itemComponents}

            </div>
        </div>

        
        <div class="card border-secondary mb-3" id = "page-update" >
            <div class="card-header"><NavBar mode="1" cancelUpdate={cancelUpdate} refreshDB={getItems}></NavBar></div>
            <div class="card-body text-secondary"  id = "content">
                <div id = "currentItem">
                    <ItemCard item = {curItem} id = "curItemPreview"/>
                </div>

                <div id = "form-entry">
                    <form>
                        <div class="form-group">
                            <label >Name</label>
                            <input type="text" class="form-control" id="nameInput" onInput={updateItemName} placeholder="Enter a name!"></input>
                        </div>

                        <div class="form-group">
                            <label >Quantity</label>
                            <input type="number" class="form-control" id="qtyInput" onInput={updateItemQty} placeholder="Enter a quantity!" ></input>
                        </div>

                        <div class="form-group">
                            <label>Upload Image</label>
                            <input type="file" class="form-control" id="imgInput" name = "imgInput" accept=".png, .jpg, .jpeg" onInput={updateItemImg}/>
                        </div>
                        
                            <div class = "form-group" id = "modify-item-btns">
                                <button type="button" class="btn btn-outline-danger" id = "delete-item" onClick = {deleteItem}>Delete </button>
                                <button type="button" class="btn btn-outline-success" id = "confirm-item" onClick = {saveItem}>Confirm</button>
                            </div>
                    </form>
                </div>

            </div>
        </div>

        <div class="card border-secondary mb-3" id = "page-addition" >
            <div class="card-header"><NavBar mode="2" showPage={showPage}refreshDB={getItems}></NavBar></div>
                <div class="card-body text-secondary"  id = "content">
                    <Addition/>
                </div>


        </div>


        <div class="card border-secondary mb-3" id = "page-welcome" >

            <div class="card-header"><NavBar mode="3" showPage={showPage} refreshDB={getItems}></NavBar></div>
                    <div class="card-body text-secondary"  id = "content">
                        Welcome!
                    </div>
        </div>


    </div>
    
  

    )

}

export default Main;