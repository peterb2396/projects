
const ItemCard = props => {

    function modify()
    {
        props.edit(props.item);
    }

    return( 
        <div id = "card-border" onClick = {modify}> 
            
            <div class="card border-secondary mb-3" id = "card">
                <div class="card-header">{props.item.name}</div>
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