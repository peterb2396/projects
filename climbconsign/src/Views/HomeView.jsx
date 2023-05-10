import React, { useState, useEffect} from "react";
import NavBar from '../components/NavBar.jsx'
import ItemCard from '../components/ItemCard.jsx'
import FormData from 'form-data';
import ItemListing from '../components/ItemListing.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.css';
import '../styles.css';
import axios from 'axios';
//import useDebounce from "../components/useDebounce.tsx";
//import List from "../components/List.jsx";

// TODO - customer select

export default function HomeView(props) {
    const DEFAULT_DESCRIPTION = {
        "size_us": -1,
        "size_eu": -1,
        "size_desc": "",
        "color_desc": "",
        "category": "",
        "brand": "",
        "condition": "",
        "price_lowest": -1,
        "extra": "",
    }

    const DEFAULT_LOGS = []
    const DEFAULT_TRANSACTIONS = {
        "listed": {
            "seller_id": -1,
            "datetime": ""

        },
        "sold": {
            "buyer_id":-1,
            "datetime":"",
            "invoice_id": -1
        },
        "payout": {
            "staff_id":-1,
            "datetime":"",
            "amount":-1
        }
    }

    const host = props.host

    //used to load items on first load
    const [loaded, setLoaded] = useState(false)
    let dummy = new FormData();
    const [item_data, setItemData] = useState(dummy)
    // items reflects our database. When it changes we refreshList() through the callback hook on this variable

    //Defines the action to be taken after pin is provided
    const [modalAction, setModalAction] = useState("")

    const [items, setItems] = useState([]);
    // eslint-disable-next-line
    const [members, setMembers] = useState(new Map())
    // to display the list, we display all names from the db, which will be each VALUE in our map.

    const [curSeller, setCurSeller] = useState("");
    const [curItem, setCurItem] = useState();
    const [curPage, setCurPage] = useState("page-view");
    const [itemComponents, setItemComponents] = useState();
    const [filter, setFilter] = useState("");

    const [payout, setPayout] = useState(0)

    // to be used for new customer search, updated with debounced keystroke
    // const [search, setSearch] = useState('') 
    //const debouncedSearch = useDebounce(search, 500)

    const [memberComps, setMemberComps] = useState([])
    
    

    //set the cashout payment amount
    const callSetPayout = React.useCallback(async(item) =>
    {
        if (item && item['product'])
        {
            await axios.get(`${host}/taxes/C/amount`)
            .then((res) => {
                let price = parseFloat(item['product']['RETAIL_PRICE'])
                let payout = (!curSeller.staff) ? price * (1 - (res.data/100)) : price
                setPayout(payout)
        })
        }
        
    }, [host, curSeller])


    //prompt cashout - Requests user pin before cashing out to authenticate the database access
    function promptCashout()
    {
        openModal("cashout")
    }

    // cashout the given item. Set it as inactive and clear the current item reference as there is now no item selected.
    function cashout()
    {

        // cashout the current item. CREATE THE LOG

        // ** No longer set to inactive here. It's inactive once it's marked as sold.
        // This is done temporarily to show the red border for demo purposes!
        curItem.product['INACTIVE'] = 1

        let transactions
        try {
            transactions = JSON.parse(curItem.product['EXTENDED_JSON']['transactions'])
        } catch (error) {
            transactions = curItem.product['EXTENDED_JSON']['transactions']
        }


        //This staff member must be known for the listing log!

        let staff = JSON.parse(props.getToken())
        let staff_id = staff['customer_id'] //store the staff_id

        transactions['payout'] =
        {
            "staff_id": staff_id,
            "datetime": now(),
            "rawdate": Date.now(),
            "amount": payout,
        }

        curItem.product['EXTENDED_JSON']['transactions'] = JSON.stringify(transactions)
        item_data.set('transactions', JSON.stringify(transactions))
        item_data.set('product', JSON.stringify(curItem.product))

        setItemData(item_data)
    
        // NOTE: now we send the whole product to the database to update it. It knows to update because it has an idea.
        // Note when we update it is pivotal that item_data is valid. item_data gets set when we click on the item so we must update the transaction now, too.

        saveToDB().then(function (response) {
            // null curItem
            setCurItem(null)
        })

    }
    
    const showPage = React.useCallback((show) =>
    {
        // Hide the open page
        document.getElementById(curPage).style.display='none';
        
        // Show the desired page
        document.getElementById(show).style.display='block';

        setCurPage(show);


    }, [curPage])

    // Get a member by their ID (all their details!) usually for displaying their details or narrowing down
    // we prepare them to display their phone and whatnot
    // we also store if they are staff to exempt from tax.
    const setSellerByID = React.useCallback(async(id) =>
    {
        await axios.get(`${host}/customers/${id}`)
        .then((response) => {
            // construct the member item from the response
            let seller = response.data[0]
            let name = seller['firstname'] + ' ' + seller['lastname']
            let homePhone = seller['home_phone']
            let cellPhone = seller['cell_phone']
            let email = seller['email']
            let id = seller['customer_id']
            // staff or not 
            let staff = (seller['customer_type'] === 'STAFF')? true: false

            // store the seller details as an object
            let this_seller = {staff: staff, name: name, homePhone: homePhone, cellPhone: cellPhone, email: email, id: id }
            setCurSeller(this_seller)
        })
        .catch((res) => {
            // we did not find member!
        })
    }, [host])

    // Clicking an item sets the current item, which in turn updates the preview component to view more details / actions
    // we must also set the bg for all items to default then set bg to highlighted for this item
    const focusItem = React.useCallback((item) => {
        setCurItem(item)
        setSellerByID(item.transactions['listed']['seller_id'])
        callSetPayout(item)

        //update the component list of members
        // remove this when changing customer search method

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

    }, [setSellerByID, callSetPayout, members])

  
    const getAllMembers = React.useCallback(async() =>
    {
        //store in a state variable map of id to name
        await axios.get(`${host}/customers`)
        .then((response) => {
            let newMap = new Map()
            response.data.forEach((member, index) => 
            {
                let found = false
                let cell = member['cell_phone']
                let home = member['home_phone']
                let display_phone = ""
                // let phone = cell? cell: home
                // determine phone to display. Prioritize cell, then home, then none
                if (cell)
                {
                    display_phone = cell
                }
                else if (home)
                {
                    display_phone = home
                }
                else
                {
                    display_phone = "(No Phone # Given!)"
                }

                response.data.forEach((member2, index2) => 
                {
                    

                    // inner loop looks for another member but with a different index
                    if (index !== index2 && `${member['firstname']} ${member['lastname']}` === `${member2['firstname']} ${member2['lastname']}`)
                    {
                        
                        newMap.set(member['customer_id'], {name: `${member['firstname']} ${member['lastname']}`, phone: display_phone, many: true})
                        found = true;
                    }

                })
                if (!found) // there was only one
                newMap.set(member['customer_id'], {name: `${member['firstname']} ${member['lastname']}`, phone: display_phone, many: false})
                
            })
            setMembers(newMap)
            return members

        })
        .catch((res) => {


        })
    }, [host, members])

    
     // Get seller by id locally (after updating database we store seller id and names to load items)
    const getSellerCache = React.useCallback((id) => {
        return members.get(id)
    }, [members])

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
        let seller = members.get(item.transactions['listed']['seller_id'])

        // PREPARE TO COMMIT THIS CHANGE - STORE THE VALUES WHICH WILL NOT CHANGE SO WE DONT OVERRIDE THEM
        // Eventually maybe this is the only thing we store in item data besides the image to send over?
        item_data.set('product', JSON.stringify(item.product))

        item_data.set('price', item.price)
        item_data.set('logs', JSON.stringify((item.logs)))
        item_data.set('name', item.name)
        item_data.set('transactions', JSON.stringify(item.transactions))
        item_data.set('description', JSON.stringify(item.description))
        item_data.set('id', item.id)
        setItemData(item_data)

        document.getElementById("nameInput").value = item.name;
    
        document.getElementById("imgInput").value = "";

        //Reset the pin so they have to verify each time
        document.getElementById("pinInput").value = "";

        document.getElementById("priceInput").value = item.price;

        document.getElementById("sellerInput").value =  (seller['many']) ? seller['name']+" @ "+seller['phone']: seller['name']

        document.getElementById("brandInput").value = item.description['brand'];

        document.getElementById("groupInput").value = item.description['category']

        document.getElementById("colorInput").value = item.description['color_desc'];

        document.getElementById("sizeInput").value = item.description['size_desc'];

        document.getElementById("details").value = item.description['extra'];

        // should we show confirm btn? make sure to call this AFTER changing the input fields!!
        validateConfirm()

    }, [showPage, members, item_data])

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
            if (String(items[i]['name']).toLowerCase().indexOf(filter.toLowerCase()) > -1
            || items[i]['description']['brand'].toLowerCase().indexOf(filter.toLowerCase()) > -1
            || items[i]['description']['size_desc'].toLowerCase().indexOf(filter.toLowerCase()) > -1
            || items[i]['description']['color_desc'].toLowerCase().indexOf(filter.toLowerCase()) > -1
            || getSellerCache(items[i].transactions['listed']['seller_id']).name.toLowerCase().indexOf(filter.toLowerCase()) > -1)
            {
                comps.push(<ItemListing item = {items[i]} edit = {updateItem} focus = {focusItem} getSellerCache = {getSellerCache} key={i} />)
            }
        }
        
        }
        setItemComponents(comps);
        
      
    }, [filter, items, updateItem, getSellerCache, focusItem])

   //ask the server to Get items from DB (reload)
    // ignore the last deleted id
    const getItems = React.useCallback(async(ignore) =>
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

        await axios.get(`${host}/items`)
        .then((response) => {
            
            let newArray = []
            response.data.forEach((item, index) => 
            {  
                let logs
                try {
                    logs = JSON.parse(item['EXTENDED_JSON']['logs'])
                } catch (error) {
                    // already parsed
                    logs = item['EXTENDED_JSON']['logs']
                }


                let desc
                try {
                    desc = JSON.parse(item['EXTENDED_JSON']['description'])
                } catch (error) {
                    // already parsed
                    desc = item['EXTENDED_JSON']['description']
                }

                let trans
                try {
                    trans = JSON.parse(item['EXTENDED_JSON']['transactions'])
                } catch (error) {
                    // already parsed
                    trans = item['EXTENDED_JSON']['transactions']
                }


                newArray.push({

                product: item, 
                // Note that the below are all accessable through product. It is my intention that the below are all deep copies and thus a modification to them
                // will modify 'product'. Therefore they're merely shortcuts to access fields of product without knowing the mumbo jumbo. If something goes wrong
                // with out of sync data, it is probably due to me not properly deep copying the data as I intend.
                id: item['PRODUCT_ID'],
                img: item['EXTENDED_JSON']['image'], 
                name: String(item['EXTENDED_JSON']['name']), 
                price: parseInt(item['RETAIL_PRICE']),
                description: desc,
                logs: logs,
                transactions: trans,

                })
            })
            setItems(newArray)
            
            refreshList(); // Populate the list with our items array from DB
          })
        .catch((res) => {
            console.log(res)
            // Not hooked up to DB (404)
            //refreshList();
        })
    }, [getAllMembers, host, members, refreshList])

   // load if not laoded yet
   if (!loaded)
   {
       setLoaded(true)
       getItems()
   }

   

    
    
    // Refresh the list when our items change
    useEffect(() => {

        refreshList();
        callSetPayout(curItem)
        
    },  [refreshList, curItem, callSetPayout]);


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
        let price = document.getElementById("priceInput").value
        let seller = document.getElementById("sellerInput").value
        
        

        if (name && price && seller)
            document.getElementById("confirm-item").style.display = 'block';
        else
            document.getElementById("confirm-item").style.display = 'none';

    }

    // begin a new item. Set defaults & prepare form-data
    function newItem()
    
    {
        getItems()

        

        // We cant delete , bc it doesnt exist yet!
        document.getElementById("delete-item").style.display = 'none';

        // ==== default form-data ===
        item_data.set('logs', JSON.stringify(DEFAULT_LOGS))
        item_data.set('name', "")
        item_data.set('id', "none")
        item_data.set('transactions', JSON.stringify(DEFAULT_TRANSACTIONS))
        item_data.set('description', JSON.stringify(DEFAULT_DESCRIPTION))

        //This staff member must be known for the listing log!

        let staff = JSON.parse(props.getToken())
        let staff_id = staff['customer_id'] //store the staff_id

        let trans = JSON.parse(item_data.get('transactions'))
        trans['listed']['staff_id'] = staff_id
        item_data.set('transactions', JSON.stringify(trans))

        setItemData(item_data)
        

        showPage("page-update");
        let newItem = {price: 0, name:"", description: DEFAULT_DESCRIPTION, transactions: DEFAULT_TRANSACTIONS, logs: DEFAULT_LOGS, img:"", id: "none" }
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

    function now()
    {
        let currentdate = new Date()
        let datetime =
         (currentdate.getMonth()+1)  + "/" 
        + currentdate.getDate() + "/"
        + currentdate.getFullYear() + " @ "  
        + ((currentdate.getHours() > 12) ? currentdate.getHours() - 12 : currentdate.getHours()) + ":"  
        + ( (String(currentdate.getMinutes()).length > 1) ? String(currentdate.getMinutes()) : "0" + String(currentdate.getMinutes()))

        return datetime
    }

    // Prompt middleware for saveItem - when we click save item, ask for pin first via modal!
    function promptSaveItem()
    {
        openModal("save item")
    }


    // Item was saved. Called from EITHER newItem or updateItem!
    // Now we set the item at index to curItem which is a copy of what we want!
    function saveItem()
    {
        // we need to set the transaction here
        
        let datetime = now()
        // use the date to update the listing date, IF it is new and just being listed. 
        if (curItem.id === "none")
        {
            let trans = JSON.parse(item_data.get('transactions'))
            // only modify the time
            trans['listed']['datetime'] = datetime
            trans['listed']['rawdate'] = Date.now()
            item_data.set('transactions', JSON.stringify(trans))
            setItemData(item_data)
            //console.log(trans)

            curItem.transactions['listed']['datetime'] = datetime; //get seller id by name
            let newItem = Object.assign({}, curItem);
            setCurItem(newItem);
        }

        
       
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
            // Grab the pin entry that was given to the modal
            let pin = document.getElementById('pinInput').value
            if (curItem?.id === "none")
            {
                // Add new item
                await axios.post(`${host}/items?pin=${pin}`, item_data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authentication: 'Bearer ...',
                    },
                })
                .then(function (response) {
                    getItems();
                    item_data.delete('image') // Remove the image reference once uploaded
                    return response.data._id; //return the id to save locally
                })
                .catch(function (response) {
                    //handle error - no DB option
                    //console.log(response);
                    
                });
            }
            else //update the item 
            {
                let product
                try {
                    product = JSON.parse(item_data.get('product'))
                } catch (error) {
                    product = item_data.get('product')
                }

                if (!product)
                {
                    product = curItem.product
                }

                product["DESCRIPTION"] = item_data.get('name')
                product["RETAIL_PRICE"] = parseInt(item_data.get('price'))
                product["EXTENDED_JSON"]["logs"] = JSON.parse(item_data.get('logs'))
                product["EXTENDED_JSON"]["transactions"] = JSON.parse(item_data.get('transactions'))
                product["EXTENDED_JSON"]["description"] = JSON.parse(item_data.get('description'))
                product["EXTENDED_JSON"]["name"] = item_data.get('name')
                product["EXTENDED_JSON"]["id"] = product["PRODUCT_ID"]

                item_data.set('id', product["PRODUCT_ID"])

                item_data.set('product', JSON.stringify(product))
                


                // set the id 
                let id = item_data.get('id')
                await axios.put(`${host}/items/${id}?pin=${pin}`, item_data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authentication: 'Bearer ...',
                    },
                })
                .then(function (response) {
                    getItems();
                    item_data.delete('image') // Remove the image reference once uploaded
                    return response.data._id; //return the id to save locally
                })
                .catch(function (response) {
                    //handle error - no DB option
                    //console.log(response);
                    
                });
            }
            
        
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
            item_data.set('name', event.target.value)
            setItemData(item_data)

            curItem.name = event.target.value;
            let newItem = Object.assign({}, curItem);
            setCurItem(newItem);
            
        }
    }

    //Updated item details - we're changing the 'extra' key to a new value
    function updateItemDetails(event)
    {
        // update the description value of extra: event.target.value
        let desc = JSON.parse(item_data.get('description'))
        desc['extra'] = event.target.value
        item_data.set('description', JSON.stringify(desc))
        setItemData(item_data)

        curItem.description = desc
        let newItem = Object.assign({}, curItem);
        setCurItem(newItem);
            
    }

    //Update item price
    function updateItemPrice(event)
    {
        
        // verify numerical
        validateConfirm()

        if (event.target.value)
        {

            item_data.set('price', event.target.value)
            setItemData(item_data)

            curItem.price = event.target.value;
            let newItem = Object.assign({}, curItem);
            setCurItem(newItem);
        }
    }

    //Update item brand
    function updateItemBrand(event)
    {
        if (event.target.value)
        {
            // update the description value of brand: event.target.value
            let desc = JSON.parse(item_data.get('description'));
            
            desc['brand'] = event.target.value
            item_data.set('description', JSON.stringify(desc))
            setItemData(item_data)

            curItem.description = desc
            let newItem = Object.assign({}, curItem);
            setCurItem(newItem);
        }
    }

    //Update item color
    function updateItemColor(event)
    {
        if (event.target.value)
        {
            // update the description value of size: event.target.value
            let desc = JSON.parse(item_data.get('description'))
            desc['color_desc'] = event.target.value
            item_data.set('description', JSON.stringify(desc))
            setItemData(item_data)

            curItem.description = desc
            let newItem = Object.assign({}, curItem);
            setCurItem(newItem);
        }
    }

    //Update item size
    function updateItemSize(event)
    {
        
        if (event.target.value)
        {
            // update the description value of size: event.target.value
            let desc = JSON.parse(item_data.get('description'))
            desc['size_desc'] = event.target.value
            item_data.set('description', JSON.stringify(desc))
            setItemData(item_data)

            curItem.description = desc
            let newItem = Object.assign({}, curItem);
            setCurItem(newItem);
        }
    }

    //Update item seller
    function updateItemSeller(event)
    {
        
        if (event.target.value)
        {
            // get seller id from string
            let seller = chooseSeller(event.target.value)

            let trans = JSON.parse(item_data.get('transactions'))
            trans['listed']['seller_id'] = seller
            item_data.set('transactions', JSON.stringify(trans))
            setItemData(item_data)
            
            curItem.transactions['listed']['seller_id'] = seller; //get seller id by name
            let newItem = Object.assign({}, curItem);
            setCurItem(newItem);

            validateConfirm()

        }
    }

    //Update item group
    function updateItemGroup(event)
    {
        
        if (event.target.value)
        {
           // update the description value of size: event.target.value
            let desc = JSON.parse(item_data.get('description'))
            desc['category'] = event.target.value
            item_data.set('description', JSON.stringify(desc))
            setItemData(item_data)

            curItem.description = desc
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
            // look for the customer who has this name and return their id.
            for (let [id, obj] of members.entries()) {
                
                if (option === obj['name'])
                {
                    return id
                }
                   
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
        item_data.set('image', img, img.name)
        // set the previous image path so we can delete it
        item_data.set('prevImg', curItem.img)
        setItemData(item_data)


        // image will point to local image until it gets stored on server at which point it will read from server
        let localsrc = URL.createObjectURL(img);
        curItem.prevImg = curItem.img
        curItem.img = localsrc;
        
        let newItem = Object.assign({}, curItem);
        setCurItem(newItem);
        

    }


    // prompt delete item (to get pin verified first)
    function promptDelete()
    {
        openModal("delete")
    }

    //Delete item
    async function deleteItem()
    {
        
        // Tell server to tell DB to remove this item (curItem)
        // nullify the curitem and then show the main page
        await axios.post(`${host}/items/delete/`, {'id': curItem.id})
        .then((response) => {
            
            setCurItem(null)
            getItems(curItem.id);
            showPage("page-view");
          });
    }

    // print barcode
    function printBarcode(id)
    {
        axios.get(`${host}/items/${id}/label`)
    }

    // Open the modal for an action to occur after entering the pin
    function openModal(action)
    {
        setModalAction(action)
        // Clear old modal pin
        document.getElementById('pinInput').value = ""

        var modal = document.getElementById("myModal");
        modal.style.display = "block";
    }

    // Execute modal function - pin has been entered, so close the modal and run the desired function
    function executeModalAction()
    {
        switch(modalAction)
        {
            case "cashout":
            {
                cashout()
                break
            }

            case "save item":
            {
                saveItem()  
                break
            }

            case "delete":
            {
                deleteItem()
                break
            }

            default:
            {
                
            }
        }

        closeModal()
    }

    //close modal
    function closeModal()
    {
        var modal = document.getElementById("myModal");
        modal.style.display = "none";
    }

    let requiredStyle = {
        color: 'red',
    }

    return (
    // MAIN VIEW PAGE
    <div id = "content-border">
        
        <div id="myModal" class="modal">

        <div class="modal-content">
            <span class="close" onClick = {closeModal}>&times;</span>

            
                <div className="form-group">

                    <label >Verify User PIN</label>
                    <input type="password" className="form-control" id="pinInput" placeholder="Enter pin..." ></input>
                </div>
            <div id = "modal-button">
                <button type="button" className="btn btn-outline-success" id = "modal-confirm" onClick = {executeModalAction}>Confirm</button>
            </div>
        </div>

        </div>

        <div className="card border-secondary mb-3" id = "page-view">
            <div className="card-header"><NavBar mode="0" newItem={newItem} updateFilter={updateFilter} showPage={showPage} refreshDB={getItems}></NavBar></div>
            <div className="card-body text-secondary"  id = "content">
                <ItemCard printBarcode = {printBarcode} payout = {payout} cashout = {promptCashout} host = {host} sellerStaff = {curSeller.staff} item = {curItem} edit = {updateItem} sellerName = {curSeller.name} sellerHomePhone = {curSeller.homePhone} sellerCellPhone = {curSeller.cellPhone} sellerEmail = {curSeller.email}/>
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
                            <label><b style = {requiredStyle}>* </b>Seller </label>
                                 <select class="form-control" id="sellerInput" onInput={updateItemSeller}>
                                    {memberComps}
                                </select>
                            </div>

                            {/* 
                             This will be how we correctly filter members by search and limit to 50
                             List will contain buttons for each matching result, clicking one will call updateItemSeller to set the seller.
                             Each List subcomponent, MemberListing, will be such a button that holds the member ID to set the reference 

                             The above code will be replaced with the below, with some additions

                            <div className="form-group">
                                <label >Seller Name</label>
                                <input type="text" className="form-control" id="sellerInput" onChange={(e) => setSearch(e.target.value)} placeholder="Search..."></input>
                                <List updateItemSeller = {updateItemSeller} search={debouncedSearch}/>
                            </div> */}



                            <div className="form-group">
                                <label ><b style = {requiredStyle}>* </b>Item Name</label>
                                <input type="text" className="form-control" id="nameInput" onInput={updateItemName} placeholder="Enter a name!"></input>
                            </div>

                            <div className="form-group">
                                <label ><b style = {requiredStyle}>* </b>Price </label>
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
                                    <button type="button" className="btn btn-outline-danger" id = "delete-item" onClick = {promptDelete}>Delete </button>
                                    <button type="button" className="btn btn-outline-success" id = "confirm-item" onClick = {promptSaveItem}>Confirm</button>
                                </div>
                                
                        </form>
                    </div>

                    <div class="form-group" id = "desc">
                        <label>Details:</label>
                        <textarea class="form-control" rows="5" cols="58" id="details" onInput={updateItemDetails}></textarea>
                        <div class="form-group">
                            <label>Item Group</label>
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
                            <img src = {curItem?.img} alt = "Item" width = "200px" height = "200px" id = "card-img"
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