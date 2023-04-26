import React, { useState, useEffect, useMemo} from "react";
import NavBar from '../components/NavBar.jsx'
import ItemCard from '../components/ItemCard.jsx'
import ItemListing from '../components/ItemListing.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.css';
import '../styles.css';
import axios from 'axios';


export default function HomeView(host) {

    //used to load items on first load
    const [loaded, setLoaded] = useState(false)
    // items reflects our database. When it changes we refreshList() through the callback hook on this variable
    const fakeItems = [
        {name: "Rope", group: "Equipment", brand: "Scarpa", size: "Large", color: "Black / Yellow", seller: 3, price: 75, img: "", id: 0, details: "this rope is in perfect condition, i got it as a gift but didnt need it."},
        {name: "Shoes", group: "Clothing",brand: "Nike", size: "8", color: "White", seller: 0, price: 45, img: "", id: 1, details: "These shoes were worn for a month, 8/10 condition and negotiable"},
        {name: "Gloves", group: "Equipment",brand: "Adidas", size: "Medium", color: "Orange", seller: 2, price: 80, img: "", id: 2, details: "Honestly very ripped up, but clean and perfect "},
        {name: "Climbing Shirt", group: "Clothing",brand: "Rebok", size: "Large", color: "Black / Gray", seller: 1, price: 15, img: "", id: 3, details: "perfect shape my son just didnt want it."},
    ]

    const fakeMembers = useMemo(() =>[
        {name: "Ariana Grande", id: 0, email: "agrande@gmail.com", phone: "555-123-123"},
        {name: "Ariana Grande", id: 1, email: "agrande2@gmail.com", phone: "555-583-117"},
        {name: "Bob Ross", id: 2, email: "bross@gmail.com", phone: "555-401-174"},
        {name: "Backstreet Boys", id: 3, email: "bboys@gmail.com", phone: "555-420-456"},
], [])
    const [items, setItems] = useState(fakeItems);
    const [memberComps, setMemberComps] = useState([])
    // eslint-disable-next-line
    const [members, setMembers] = useState(new Map())
    // to display the list, we display all names from the db, which will be each VALUE in our map.

    const [curSeller, setCurSeller] = useState("");
    const [curItem, setCurItem] = useState(items[0]);
    const [curPage, setCurPage] = useState("page-view");
    const [itemComponents, setItemComponents] = useState();
    const [filter, setFilter] = useState("");
    
    
    const showPage = React.useCallback((show) =>
    {
        // Hide the open page
        document.getElementById(curPage).style.display='none';
        
        // Show the desired page
        document.getElementById(show).style.display='block';

        setCurPage(show);


    }, [curPage])

    //Get a member by their ID (all their details!) usually for displaying their details or narrowing down
    const setSellerByID = React.useCallback(async(id) =>
    {
        await axios.get(`${host}/getMember/${id}`)
        .then((response) => {
            // we found the member!
        })
        .catch((res) => {
            // we did not find member!
            // now... use dummy data.
            setCurSeller(fakeMembers[id])
        })
    }, [fakeMembers, host])

    // Clicking an item sets the current item, which in turn updates the preview component to view more details / actions
    // we must also set the bg for all items to default then set bg to highlighted for this item
    const focusItem = React.useCallback((item) => {
        setCurItem(item)
        setSellerByID(item.seller)
    }, [setSellerByID])

  
    // We clicked EDIT on an item
    // store the details in form in case we hit update we can pass the data through
    // Hide the confirm button until a modification is made???
    const updateItem = React.useCallback((item) =>
    {
        
        // We can delete , bc it does exist here!
        document.getElementById("delete-item").style.display = 'block';
        

        // We need to show the update page and display this item there
        showPage("page-update");

        let oldItem = Object.assign({}, item);
        setCurItem(oldItem) // A copy of the original item
        let seller = members.get(item.seller)


        document.getElementById("nameInput").value = item.name;
    
        document.getElementById("imgInput").value = "";

        document.getElementById("priceInput").value = item.price;

        document.getElementById("sellerInput").value = (seller.many) ? seller.name+" @ "+seller.phone: seller.name //get dictionary by map key, then get name

        document.getElementById("brandInput").value = item.brand;

        document.getElementById("groupInput").value = item.group

        document.getElementById("colorInput").value = item.color;

        document.getElementById("sizeInput").value = item.size;

        document.getElementById("details").value = item.details;

        // should we show confirm btn? make sure to call this AFTER changing the input fields!!
        validateConfirm()

    }, [showPage, members])

    // Refresh the view, does NOT update from DB! That occurs when we add, delete, modify or refresh.
    // here is where we display warning for no items if that is the case

     // Get seller by id locally (after updating database we store seller id and names to load items)
     const getSellerCache = React.useCallback((id) => {
        return members.get(id)
    }, [members])

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
            if (items[i].name.toLowerCase().indexOf(filter.toLowerCase()) > -1
            || items[i].brand.toLowerCase().indexOf(filter.toLowerCase()) > -1
            || items[i].size.toLowerCase().indexOf(filter.toLowerCase()) > -1
            || items[i].color.toLowerCase().indexOf(filter.toLowerCase()) > -1
            || getSellerCache(items[i].seller).name.toLowerCase().indexOf(filter.toLowerCase()) > -1)
            {
                comps.push(<ItemListing item = {items[i]} edit = {updateItem} focus = {focusItem} getSellerCache = {getSellerCache} key={i} />)
            }
        }
        
        }
        setItemComponents(comps);
        
      
    }, [filter, items, updateItem, getSellerCache, focusItem])

   // load if not laoded yet
   if (!loaded)
   {
       setLoaded(true)
       refreshList()
   }

    //Issue: How do we get all of the possible sellers?
    // Solution: its just all members! Run a query to get ALL names and id's
    // Run this and update the list of all members each time we modify an item to get the most recent customers.
    // It will be a map of ID->name. We display the name but store the iD
    // this way, when we would like to retrieve all seller details we can just pass the id.
    async function getAllMembers()
    {
        //store in a state variable map of id to name
        await axios.get(`${host}/getAllMembers`)
        .then((response) => {

            let newMap = new Map()
            response.data.forEach((member, index) => 
            {
                let found = false
                response.data.forEach((member2, index2) => 
                {
                    // inner loop looks for another member but with a different index
                    if (index !== index2 && member.name === member2.name)
                    {
                        newMap.set(member.id, {name: member.name, phone: member.phone, many: true})
                        found = true;
                    }

                })
                if (!found) // there was only one
                    newMap.set(member.id, {name: member.name, phone: member.phone, many: false})
                
            })
                
            setMembers(newMap)
            return members

        })
        .catch((res) => {


            let newMap = new Map()
            for (let i in fakeMembers)
            {
                let member = fakeMembers[i]
                let found = false
                for (let j in fakeMembers)
                {
                    let member2 = fakeMembers[j]
                    if (i !== j && member.name === member2.name)
                    {
                        found = true;
                        newMap.set(member.id, {name: member.name, phone: member.phone, many: true})
                    }
                }
                if (!found)
                    newMap.set(member.id, {name: member.name, phone: member.phone, many: false})
            }

            setMembers(newMap)
            return members;
        })
    }

    

    //ask the server to Get items from DB (reload)
    // ignore the last deleted id
    async function getItems(ignore)
    {
        // We need to get a list of all the members from the DB
        // this is a map of id to name
        // We need to convert this to a component list which will be displayed as our dropdown.
        getAllMembers() //sets up the id->name map.
        .then(() => { //when we're ready with the map
            let comps = []
            // eslint-disable-next-line
            for (let [id, member] of members)
            {
                if (member.many) //if there are multiple of this member...
                {
                    comps.push(<option>{member.name} @ {member.phone}</option>)
                    
                }
                else // we can just push the name, there is only one.
                    comps.push(<option>{member.name}</option>)
            }
            setMemberComps(comps)
        })

        await axios.get(`${host}/getAllItems`)
        .then((response) => {
            
            let newArray = []
            response.data.forEach((item, index) => 
            {
                if (!newArray.includes({name: item.name, qty: item.qty, img: item.img, id: item._id}) && (item._id !== ignore))
                {
                    newArray.push({name: item.name, qty: item.qty, img: item.img, id: item._id, details: item.details})
                }
            })
            setItems(newArray)// not doing anything?
            refreshList(); // Populate the list with our items array from DB
          })
        .catch((res) => {
            //console.log(res)
            // Not hooked up to DB
            refreshList();
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
        // Make sure the required fields exist
        let name = document.getElementById("nameInput").value
        let qty = document.getElementById("priceInput").value

        if (name && qty)
            document.getElementById("confirm-item").style.display = 'block';
        else
            document.getElementById("confirm-item").style.display = 'none';

    }

    function newItem()
    
    {
        // We cant delete , bc it doesnt exist yet!
        document.getElementById("delete-item").style.display = 'none';

        showPage("page-update");
        let newItem = {name:"", qty:0, img:"", id: "none", details: "" }
        setCurItem(newItem) // A copy of the original item

        document.getElementById("nameInput").value = ""
        document.getElementById("priceInput").value = ""
        document.getElementById("imgInput").value = ""
        document.getElementById("sellerInput").value = ""
        document.getElementById("brandInput").value = ""
        document.getElementById("colorInput").value = ""
        document.getElementById("sizeInput").value = ""
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
       //getItems(); //load new values
      
        
    }

    // Save the current item to the database and return the unique id and then store it here so we can delete or modify it
    // either save it or add it
    async function saveToDB()
    {
            await axios.post(`${host}/addItem`, 
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                  Authentication: 'Bearer ...',
                },
              })
          .then(function (response) {
            getItems();
            
            return response.data._id; //return the id to save locally
          })
          .catch(function (response) {
            //handle error - no DB option
            //console.log(response);
            items[curItem.id] = curItem;
            setItems(items)
            
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

            curItem.name = event.target.value;
            let newItem = Object.assign({}, curItem);
            setCurItem(newItem);
            
        }
    }

    //Updated item details 
    function updateItemDetails(event)
    {

        curItem.details = event.target.value;
        let newItem = Object.assign({}, curItem);
        setCurItem(newItem);
            
    }

    //Update item qty
    function updateItemPrice(event)
    {
        
        // verify numerical
        validateConfirm()

        if (event.target.value)
        {
            curItem.qty = event.target.value;
            let newItem = Object.assign({}, curItem);
            setCurItem(newItem);
        }
    }

    //Update item brand
    function updateItemBrand(event)
    {
        if (event.target.value)
        {
            curItem.brand = event.target.value;
            let newItem = Object.assign({}, curItem);
            setCurItem(newItem);
        }
    }

    //Update item color
    function updateItemColor(event)
    {
        if (event.target.value)
        {
            curItem.color = event.target.value;
            let newItem = Object.assign({}, curItem);
            setCurItem(newItem);
        }
    }

    //Update item size
    function updateItemSize(event)
    {
        
        if (event.target.value)
        {
            curItem.size = event.target.value;
            let newItem = Object.assign({}, curItem);
            setCurItem(newItem);
        }
    }

    //Update item seller
    function updateItemSeller(event)
    {
        
        if (event.target.value)
        {
            // Must go backward to get the ID
            curItem.seller = chooseSeller(event.target.value); //get seller id by name
            let newItem = Object.assign({}, curItem);
            setCurItem(newItem);
        }
    }

    //Update item group
    function updateItemGroup(event)
    {
        
        if (event.target.value)
        {
            curItem.group = event.target.value //get seller id by name
            let newItem = Object.assign({}, curItem);
            setCurItem(newItem);
        }
    }

    // Get seller id by option (name + number)
    function chooseSeller(option) {
        // if a phone number is included we must find the seller that matches the number
        if (option.includes("@"))
        {
            let tokens = option.split(" @ ")
            let name = tokens[0]
            let phone = tokens[1]

            // Now we find the seller with this name and phone
            return getMemberIDByNameAndPhone(name, phone)

        }
        else
        {
            for (let [id, name] of members.entries()) {
                if (option === name)
                    return id
            }
            return null
        }
    }

    // get seller id by name and phone
    async function getMemberIDByNameAndPhone(name, phone)
    {
        await axios.get(`${host}/getSellerByNameAndPhone/${name}/${phone}`)
        .then((res) => {
            // success, DB connected (result may still have no matches though!)
            return res.body
        })
        .catch((res) =>{
            //fail, DB not connected probably
            // use dummy data
            for(let i in fakeMembers)
            {
                let cur = fakeMembers[i]
                if (cur.name === name && cur.phone === phone)
                    return cur.id
            }
            // no matches found!
            return -1

        })
    }

    //Update item img
    // We need to handle the image file and turn it to form data to send over api
    // then we have to deconstruct on the other end (when displaying in icon!)
    function updateItemImg(event)
    {
        const input = document.getElementById("imgInput");
        const img = input.files[0];
        
        // Local image storage
        // image will point to local image until it gets stored on server at which point it will read from server
        let localsrc = URL.createObjectURL(img);
        curItem.prevImg = curItem.img;
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
            <div className="card-header"><NavBar mode="0" newItem={newItem} updateFilter={updateFilter} showPage={showPage} refreshDB={getItems}></NavBar></div>
            <div className="card-body text-secondary"  id = "content">
                <ItemCard item = {curItem} edit = {updateItem} sellerName = {curSeller.name} sellerPhone = {curSeller.phone} sellerEmail = {curSeller.email}/>
                <div id = "item-container">
                    <div id = "detail-header">
                        <div id = "item-detail">Name</div>
                        <div id = "item-detail">Brand</div>
                        <div id = "item-detail">Color</div>
                        <div id = "item-detail">Size</div>
                        <div id = "item-detail">Seller</div>
                        <div id = "item-detail">Price</div>
                    </div>

                    <div id = "items">
                        {itemComponents}
                    </div>
                </div>

            </div>
        </div>

        <div className="card border-secondary mb-3" id = "page-update" >
  

            <div className="card-header"><NavBar mode="1" cancelUpdate={cancelUpdate} refreshDB={getItems}></NavBar></div>
            <div className="card-body text-secondary"  id = "content">

                <div id = "form-entry">
                    <div id = "left-entry">
                        <form>
                            <div class="form-group">
                            <label>Seller</label>
                                 <select class="form-control" id="sellerInput" onInput={updateItemSeller}>
                                    {memberComps}
                                </select>
                            </div>
                            <div className="form-group">
                                <label >Item Name</label>
                                <input type="text" className="form-control" id="nameInput" onInput={updateItemName} placeholder="Enter a name!"></input>
                            </div>

                            <div className="form-group">
                                <label >Price</label>
                                <input type="number" className="form-control" id="priceInput" onInput={updateItemPrice} placeholder="Enter a price!" ></input>
                            </div>

                            <div className="form-group">
                                <label >Brand</label>
                                <input type="text" className="form-control" id="brandInput" onInput={updateItemBrand} placeholder="Enter a brand!" ></input>
                            </div>

                            <div className="form-group">
                                <label >Color</label>
                                <input type="text" className="form-control" id="colorInput" onInput={updateItemColor} placeholder="Enter a color!" ></input>
                            </div>

                            <div className="form-group">
                                <label >Size</label>
                                <input type="text" className="form-control" id="sizeInput" onInput={updateItemSize} placeholder="Enter a size!" ></input>
                            </div>

                            
                            
                                <div class = "form-group" id = "item-buttons">
                                    <button type="button" className="btn btn-outline-danger" id = "delete-item" onClick = {deleteItem}>Delete </button>
                                    <button type="button" className="btn btn-outline-success" id = "confirm-item" onClick = {saveItem}>Confirm</button>
                                </div>
                                
                        </form>
                    </div>

                    <div class="form-group" id = "desc">
                        <label>Details:</label>
                        <textarea class="form-control" rows="5" cols="58" id="details" onInput={updateItemDetails}></textarea>
                        <div class="form-group">
                            <label>Tax Group</label>
                                 <select class="form-control" id="groupInput" onInput={updateItemGroup}>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Equipment">Equipment</option>
                                    <option value="Books">Books</option>
                                </select>
                            </div>

                        <div className="form-group" id = "img-file-browser">
                                <label>Upload Image</label>
                                <input type="file" className="form-control" id="imgInput" name = "imgInput" accept=".png, .jpg, .jpeg" onInput={updateItemImg}/>
                            </div>
                            <img src = {curItem.img} alt = "Item" width = "200px" height = "200px" id = "card-img"
                                onError={event => {
                                    // Load the default image
                                    event.target.src = "default-img.jpg"
                                    event.onerror = null
                                    //console.log("failed to load image:", props.item.img)
                                }}></img>
                    </div> 
                    
                    
                </div>

                

            </div>
        </div>
        


    </div>
    
  

    )

}