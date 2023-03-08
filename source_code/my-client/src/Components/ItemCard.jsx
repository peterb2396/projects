import React, { useEffect} from "react";
const ItemCard = props => {

    useEffect(() => {    

    },  [props.item]);

    //When we click, send this item as a ref
    function modify()
    {
        if (props.edit && props.item)
            props.edit(props.item);
    }

    
    if (props.item)
    {
        //testImage(props.item.img); //go through test first to verify image or assign NA image {props.item.img}
        return( 
            <div id = "card-border" onClick = {modify}> 
                
                <div className="card border-secondary mb-3" id = "card">
                    <div className="card-header">{(props.item.name)? props.item.name : "Item Name"}</div>
                    <div className="card-body text-secondary">
                        <img src = {props.item.img} alt = "Item" width = "200px" height = "200px" id = "card-img"
                        onError={event => {
                            // Load the default image
                            event.target.src = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                            event.onerror = null
                            console.log("failed to load image:", props.item.img)
                          }}></img>
                        <div id = "qty">
                            <p className="card-text">Quantity:</p>
                            <p id = "item-qty">{props.item.qty}</p>
                        </div>
                    </div>
                </div>
        
            </div>
            )
        // return test()
        
    
    }


    

    
}

export default ItemCard;