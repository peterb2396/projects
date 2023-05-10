import React from "react";

const LogListing = props => {
    
    if (props.log)
    {
        return( 
            <div class = "item" id = "item">
                <div id = "item-detail-hbox">
                    <div id = "item-detail">{props.log.staff}</div>
                    <div id = "item-detail">{props.log.action}</div>
                    <div id = "item-detail">{props.log.item}</div>
                    <div id = "item-detail">{props.log.value}</div>
                    <div id = "item-detail">{props.log.datetime}</div>
                </div>
            </div>
            )
    }
    
}

export default LogListing;