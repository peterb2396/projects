import React, {useState, useEffect} from 'react'
import axios from 'axios'


const LOGIN_STYLES = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: "rgba(200, 255, 255, 1)",
    padding: '50px',
    textAlign: 'center'
}

const tempStyle = {
    padding: '10px'
}

// FIXME This should be called whenever something significant happens so that we can auth... 
// When we're editing anything pretty much, to enter the edit window and to save, must re-auth

export default function LoginView(props) {
    const [pinFailed, setPinFailed] = useState(false)
    

    //when pin auth is updated
    useEffect(() => {     
        if (pinFailed)
        {
            document.getElementById("pin").className = "form-control is-invalid"
        }
    });
    
    /** TODO Force the focus aways on the pin input. Or have it so w/e a number key is put in, 
     * it adds it to the value and moves focus
     */
    function handleKeyDown(event) {
        // Only allow numbers and delete/backspace to be entered
        if(!isFinite(event.key) && !(event.key === 'Delete') && !(event.key === 'Backspace')) {
            event.preventDefault()
        }
        document.getElementById("pin").className = "form-control"
        // If they hit enter, authenticate the PIN
        if(event.key === 'Enter') {
            const PIN = event.target.value.trim();
            event.target.value = '';
            authenticatePin(PIN)
        }
    }

    async function authenticatePin(PIN) {
        // DEBUG
        console.log(`PIN is ${PIN}, setting auth to ${(PIN === '123')}`)

        // When pin is good, we store it on the browser so we remember it on refresh
        // this token will be the userid of this user from the db
        await axios.post(`${props.host}/auth/${PIN}`)
        .then((response) => {
            setPinFailed(false)
            props.setToken(JSON.stringify(response.data))
            // Refresh to see the homeview
            window.location.reload(false);
        })
        .catch((response) => {
            //not authorized!
            setPinFailed(true)
        })


        if (pinFailed) //handles subsequent failures
        {
            document.getElementById("pin").className = "form-control is-invalid"
        }
        
    }

    function handleFocus() {
        document.getElementById("pin").className = "form-control"
    }

    return (
        <>
        <div style= {{backgroundColor: 'blue'}}>
            <div style={LOGIN_STYLES}>
                <h2>Climb Consign</h2>

                <div style = {tempStyle}>
                <input
                    class = "form-control"
                    id = "pin"
                    type="password" 
                    autoComplete='off' 
                    onKeyDown={handleKeyDown} 
                    onFocus={handleFocus}
                    placeholder="Enter PIN"
                />
                </div>
                {
                    pinFailed ? (
                        <p>PIN failed. Try again.</p>
                    ) 
                    : (
                        ""
                    )
                }
            </div>
            </div>
        </>
    )
}