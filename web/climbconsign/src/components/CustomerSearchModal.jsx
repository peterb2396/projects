import React from 'react'
import ReactDOM from 'react-dom'

const MODAL_STYLES = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#ffF',
    padding: '50px',
    zIndex: 1000
}

const OVERLAY_STYLES = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .3)',
    zIndex: 1000
}

export default function CustomerSearchModal({open, onSelect}) {
    /* don't return anything if it's not open */
    if(!open) 
        return null;
    
    
    /* Create it as a portal so it'll overlay everything */
    return ReactDOM.createPortal(
        <>
            <div style={OVERLAY_STYLES}/>
            <div style={MODAL_STYLES}>
                <h3>Search Customer</h3>
                <div> 
                    <input type="text" placeholder='Lastname, Firstname' onChange={onEdit}></input>
                    <button onClick={onSelect}>Close</button>
                </div>
            </div>
        </>,
        document.getElementById("modals")
    )
}

function onEdit(event) {
    /* Split into lastname and firstname by , or ,\s or , */
    const [lastname, firstname] = event.target.value.split(/,\s|\s|,/)
    console.log(`lastname: ${lastname} firstname: ${firstname}`) 
}

/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Enter PIN
        </p>
        <CustomerSearchModal 
          open={isSearching}
          onSelect={() => {
            setIsSearching(false)
          }}
        />
        <button onClick={() => {setIsSearching(true) }}>Popup</button>
      </header> */