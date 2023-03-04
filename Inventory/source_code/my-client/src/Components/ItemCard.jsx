import React, { useEffect} from "react";
const ItemCard = props => {

    useEffect(() => {    
        //console.log(props.item.img)
        
    },  [props.item]);

    //When we click, send this item as a ref
    function modify()
    {
        if (props.edit)
            props.edit(props.item);
    }

    return( 
        <div id = "card-border" onClick = {modify}> 
            
            <div class="card border-secondary mb-3" id = "card">
                <div class="card-header">{(props.item.name)? props.item.name : "Item Name"}</div>
                <div class="card-body text-secondary">
                    <img src = {props.item.img} alt = "Item" width = "200px" height = "200px" id = "card-img"></img>
                    <div id = "qty">
                        <p class="card-text">Quantity:</p>
                        <p id = "item-qty">{props.item.qty}</p>
                    </div>
                </div>
            </div>
    
        </div>
        )
}

export default ItemCard;