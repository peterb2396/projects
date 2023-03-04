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
    


    const items = 
    [
        {name:"Milo", qty:4, img: "http://clipart-library.com/img/1678242.png"},
        {name:"Luna", qty:2, img: "http://clipart-library.com/img/1678251.png"},
        {name:"Fin", qty:8, img: "http://clipart-library.com/img/1678368.png"}
    ]

    const [curItem, setCurItem] = useState(items[0]);
    const [curPage, setCurPage] = useState("page-view");
    const [itemComponents, setItemComponents] = useState();

    

    
    function showPage(show)
    {
        // Hide the open page
        document.getElementById(curPage).style.display='none';

        // Show the desired page
        document.getElementById(show).style.display='block';

        setCurPage(show);

    }

    function updateItem(item)
    {
        // We need to show the update page and display this item there
        showPage("page-update");
        setCurItem(item)

    }

    // Refresh the view from database (or dummy)
    function refreshList()
    {
        // Will reflect whatever is in our item array
        // When do we set the array to the database content?
        // Maybe i should do it here too since this function runs on the effect hook?
        setItemComponents( 
            items.map(item => (
            <ItemCard item = {item} edit = {updateItem} key={items.indexOf(item)} />
            ))
        )
      
    }

    // Add a new item: Show the new item page with a new blank item ref that will reflect updates (useState)
    // use curItem for this? probably!
    function newItem()
    {
        
    }

    

    return (
    // MAIN VIEW PAGE
    <div id = "content-border">
        <div class="card border-secondary mb-3" id = "page-view">
                    <div class="card-header"><NavBar mode="0" newItem={newItem}></NavBar></div>
                    <div class="card-body text-secondary"  id = "content">
                        
                        {itemComponents}

                    </div>
        </div>

        
        <div class="card border-secondary mb-3" id = "page-update" >
                    <div class="card-header"><NavBar mode="1" showPage={showPage}></NavBar></div>
                    <div class="card-body text-secondary"  id = "content">
                        <div id = "currentItem">
                            <ItemCard item = {curItem} id = "curItemPreview"/>
                        </div>
                    </div>
        </div>
    </div>
    
  

    )

}

export default Main;