
const ItemCard = props => {


    //When we click, send this item as a ref
    function modify()
    {
        if (props.edit && props.item)
            props.edit(props.item);
    }

    function cashoutItem()
    {
    
    }
    function deleteItem()
    {

    }

    //view more details
    function viewDetails()
    {
        showBackButton(true)
        document.getElementById("item-details").style.display = 'none'

        document.getElementById("seller-details").style.display = 'none'
        document.getElementById("more-details").style.display = 'block'
        
    }

    function viewSeller()
    {
        showBackButton(true)
        document.getElementById("item-details").style.display = 'none'

        document.getElementById("seller-details").style.display = 'block'
        document.getElementById("more-details").style.display = 'none'
        
    }

    function showBackButton(show)
    {
        document.getElementById("back-to-item").style.display = show ? "block":"none"

        document.getElementById("del-item").style.display = !show ? "inline-block":"none"
        document.getElementById("cashout-item").style.display = !show ? "inline-block":"none"
    }

    // In a sub menu such as seller, more details.. clicked back to view the item view again
    function back()
    {
        showBackButton(false)

        document.getElementById("item-details").style.display = 'block'

        document.getElementById("seller-details").style.display = 'none'
        document.getElementById("more-details").style.display = 'none'
        
    }
    
    if (props.item)
    {
        //testImage(props.item.img); //go through test first to verify image or assign NA image {props.item.img}
        return( 
            <div id = "card-border"> 
                
                <div className="card border-secondary mb-3" id = "card">
                    <div className="card-header" id="card-name">{(props.item.name)? props.item.name : "Item Name"}</div>
                    <div className="card-body text-secondary" id = "item-details">
                        
                        <img src = {props.item.img} alt = "Item" width = "200px" height = "200px" id = "card-img"
                        onError={event => {
                            // Load the default image
                            event.target.src = "default-img.jpg"
                            event.onerror = null
                            //console.log("failed to load image:", props.item.img)
                          }}></img>
                        <div id = "item-options">
                            <button type="button" className="btn btn-outline-primary" id = "item-option" onClick = {viewSeller}>Seller Details </button>
                            <button type="button" className="btn btn-outline-primary" id = "item-option" onClick = {viewDetails}>More Details </button>
                            <button type="button" className="btn btn-outline-primary" id = "item-option" onClick = {modify}>Modify Item </button>

                        </div>
                    </div>

                    <div className="card-body text-secondary" id = "seller-details">
                        Name: {props.sellerName}
                          <br/>
                        Phone: {props.sellerPhone}
                          <br/>
                        Email: {props.sellerEmail}
                    </div>

                    <div className="card-body text-secondary" id = "more-details">
                        Tax Group:<br/>
                        {props.item.group}
                        <br/><br/>

                        Listed Details:<br/>
                        {props.item.details}
                    </div>
                    
                    <div class = "form-group" id = "item-btns">
                        <button type="button" className="btn btn-outline-secondary" id = "del-item" onClick = {deleteItem}>Delete</button>
                        <button type="button" className="btn btn-outline-secondary" id = "cashout-item" onClick = {cashoutItem}>Cashout</button>
                        <button type="button" className="btn btn-outline-secondary" id = "back-to-item" onClick = {back}>Back</button>
                    </div>

                </div>
                
        
            </div>
            )
        
    
    }
    else
    {
        return( 
            <div id = "card-border"> 
                
                <div className="card border-secondary mb-3" id = "card">
                    <div className="card-header" id="card-name">Item Name</div>
                    <div className="card-body text-secondary" id = "item-details">
                        
                        <img src = "" alt = "Item" width = "200px" height = "200px" id = "card-img"
                        onError={event => {
                            // Load the default image
                            event.target.src = "default-img.jpg"
                            event.onerror = null
                            //console.log("failed to load image:", props.item.img)
                          }}></img>
                        <div id = "item-options">
                            <button type="button" className="btn btn-outline-primary" id = "item-option" onClick = {viewSeller}>Seller Details </button>
                            <button type="button" className="btn btn-outline-primary" id = "item-option" onClick = {deleteItem}>More Details </button>
                            <button type="button" className="btn btn-outline-primary" id = "item-option" onClick = {deleteItem}>Modify Item </button>

                        </div>
                    </div>

                    <div className="card-body text-secondary" id = "seller-details">
                          

                    </div>
                    
                    <div class = "form-group" id = "item-btns">
                        <button type="button" className="btn btn-outline-secondary" id = "del-item" onClick = {deleteItem}>Delete</button>
                        <button type="button" className="btn btn-outline-secondary" id = "cashout-item" onClick = {cashoutItem}>Cashout</button>
                        <button type="button" className="btn btn-outline-secondary" id = "back-to-item" onClick = {back}>Back</button>
                    </div>

                </div>
                
        
            </div>
            )
    }
}

export default ItemCard;