
const ItemCard = props => {

    

    //When we click, send this item as a ref
    function modify()
    {
        if (props.edit && props.item)
            props.edit(props.item);
    }


    function cashoutItem()
    {
        // we need to view a new page. show: item name, seller name, how much sellers is owed
        showBackButton(true)
        document.getElementById("item-details").style.display = 'none'
        document.getElementById("seller-details").style.display = 'none'
        document.getElementById("more-details").style.display = 'none'
        document.getElementById("cashout-details").style.display = 'block'
        document.getElementById("cashout-confirm").style.display = 'block'
        
    
    }

    // Return to the standard card view
    function standardView()
    {
        // we need to view a new page. show: item name, seller name, how much sellers is owed
        showBackButton(false)
        document.getElementById("item-details").style.display = 'block'
        document.getElementById("seller-details").style.display = 'none'
        document.getElementById("more-details").style.display = 'none'
        document.getElementById("cashout-details").style.display = 'none'
        document.getElementById("cashout-confirm").style.display = 'none'
        
    
    }

    // confirm the cashout. Reauth
    function confirmCashout()
    {
        
        // Set as inactive and nullify curitem
        props.cashout()

        //get out of cashout view
        standardView()
    }

    //view more details
    function viewDetails()
    {
        showBackButton(true)
        document.getElementById("item-details").style.display = 'none'
        document.getElementById("cashout-details").style.display = 'none'
        document.getElementById("seller-details").style.display = 'none'
        document.getElementById("more-details").style.display = 'block'
        document.getElementById("print-barcode").style.display = 'none'
        
    }

    function viewSeller()
    {
        showBackButton(true)
        document.getElementById("item-details").style.display = 'none'
        document.getElementById("cashout-details").style.display = 'none'
        document.getElementById("seller-details").style.display = 'block'
        document.getElementById("more-details").style.display = 'none'
        document.getElementById("print-barcode").style.display = 'none'
        
    }

    function showBackButton(show)
    {
        document.getElementById("back-to-item").style.display = show ? "block":"none"

        document.getElementById("cashout-item").style.display = !show ? "inline-block":"none"
    }

    // In a sub menu such as seller, more details.. clicked back to view the item view again
    function back()
    {
        showBackButton(false)
        document.getElementById("item-details").style.display = 'block'
        document.getElementById("print-barcode").style.display = 'block'

        document.getElementById("seller-details").style.display = 'none'
        document.getElementById("more-details").style.display = 'none'
        document.getElementById("cashout-details").style.display = 'none'
        document.getElementById("cashout-confirm").style.display = 'none'
        
    }
    if (props.item && !props.item.img)
    {
        props.item.img = "default-img.jpg"
    }


    // print barcode
    function printBarcode()
    {
        props.printBarcode(props.item.id)
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
                          }}></img>
                        <div id = "item-options">
                            <button type="button" className="btn btn-outline-primary" id = "item-option" onClick = {viewSeller}>Seller Details </button>
                            <button type="button" className="btn btn-outline-primary" id = "item-option" onClick = {viewDetails}>More Details </button>
                            <button type="button" className="btn btn-outline-primary" id = "item-option" onClick = {modify}>Modify Item </button>

                        </div>
                    </div>

                    <div className="card-body text-secondary" id = "seller-details">
                        <b>Seller</b>
                        <br/>
                        {String(props.sellerName).toUpperCase()}
                          <br/>
                          <div style = {{paddingtop: '10px'}}>
                          <img src = "email.png" width = "20" style = {{paddingRight: '5px'}}alt = "Home Phone: "></img>{props.sellerEmail}
                          </div>
                          <br/>
                        <img src = "homephone.png" width = "20" style = {{paddingRight: '5px'}}alt = "Home Phone: "></img>{props.sellerHomePhone}
                          <br/>
                        <img src = "cellphone.png" width = "20" style = {{paddingRight: '5px'}}alt = "Home Phone: "></img>{props.sellerCellPhone}
                         
                        
                    </div>

                    <div className="card-body text-secondary" id = "cashout-details">
                        Seller Name: {props.sellerName}
                          <br/>
                        Payout Amount: {props.payout}
                    </div>

                    <div className="card-body text-secondary" id = "more-details">
                        Item Group:<br/>
                        {props.item.description? props.item.description['category']: "error"}
                        <br/><br/>

                        Listed Details:<br/>
                        {props.item.description? props.item.description['extra']: "error"}
                    </div>
                    
                    <div class = "form-group" id = "item-btns">
                        <button type="button" className="btn btn-outline-secondary" id = "cashout-item" onClick = {cashoutItem}>Cashout</button>
                        <button type="button" className="btn btn-outline-secondary" id = "print-barcode" onClick = {printBarcode}>Print Barcode</button>
                        <button type="button" className="btn btn-outline-secondary" id = "cashout-confirm" onClick = {confirmCashout}>Confirm</button>
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
                    <div className="card-header" id="card-name">CLIMB CONSIGN</div>
                    <div className="card-body text-secondary" id = "item-details">
                        
                        <img src = "edge_logo.png" alt = "Item" width = "200px" height = "200px" id = "card-img"
                        onError={event => {
                            // Load the default image
                            event.target.src = "default-img.jpg"
                            event.onerror = null
                            //console.log("failed to load image:", props.item.img)
                          }}></img>
                        <h1 id = "prompt">Please select an item!</h1>  
                        
                    </div>

                    

                </div>
                
        
            </div>
            )
    }
}

export default ItemCard;