const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

function createWindow() {
    app.on('window-all-closed', () => {
        /* Since apple requires that the app exists after all windows are closed, 
        only quit the app on win and linux */
        if(process.platform != 'darwin') {
            app.quit();
        }
    })

    /** Fetch the starting URL to laod */
    const startURL = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true
    })

    /** Create a new window */
    const window = new BrowserWindow({
        width: 900,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    /** Load up the start URL */
    window.loadURL(startURL)
}

/* When the app is ready, create the window */
app.whenReady().then(createWindow);

/** Create a window if it's activated and there aren't any windows */
app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length == 0) {
        createWindow()
    }
})

// Try to connect to DB
//db connection
var mongoose = require('mongoose');
const uri = 'mongodb+srv://peterbuo:m3x93WLJhWFagQP@inventorysite.lbmkkjb.mongodb.net/?retryWrites=true&w=majority'
async function connect(){
  try {
    await mongoose.connect(uri)
    console.log("Connected to mongoDB")
  }
  catch(error){
    console.log(error)
  }
}


connect();