import React from "react";

const ItemListing = props => {
    let myRef = React.createRef();

    function focus()
    {
        props.focus(props.item)
        // highlight the item
        let items = document.getElementsByClassName("item")
        
        for (let i = 0; i < items.length; i++) {
            items[i].style.background = "#fefefe"
        }

        myRef.current.style.background = "#ececec"
        
    }
    let warning = props.item.id+"-warning"
    let warningStyle = {
        display: 'none',
        color: 'red',
    }

    let seller = props.getSellerCache(props.item.seller)
    let sellerName
    if (seller)
    {
        sellerName = seller.name
        if (seller.many)
            document.getElementById(warning).style.display = 'inline'
    }
        
    else
        sellerName = "unknown"

 
    
    if (props.item)
    {
        return( 
            <div class = "item" id = "item" onClick = {focus} ref={myRef}>
                <div id = "item-detail-hbox">
                    <div id = "item-detail">{props.item.name}</div>
                    <div id = "item-detail">{props.item.brand}</div>
                    <div id = "item-detail">{props.item.color}</div>
                    <div id = "item-detail">{props.item.size}</div>
                    <div id = "item-detail">{sellerName} <b id = {warning} style = {warningStyle}> !</b></div>
                    <div id = "item-detail">{props.item.price}</div>
                </div>
                

            </div>
            )
        
    
    }
    
}

export default ItemListing;