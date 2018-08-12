

const {app, BrowserWindow, Menu, shell, ipcMain} = require('electron')
const path = require('path')

if (process.env.NODE_ENV === 'development') {
  require('electron-reload')(__dirname, { electron: require(`${__dirname}/node_modules/electron`) })
}


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1000,
    minWidth: 800,
    height: 800,
    minHeight:600})

  // and load the index.html of the app.
  win.loadFile('src/home/index.html')

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  var menu = Menu.buildFromTemplate([
    {
      label:'Menu',
      submenu:[
        {label:"raymus",click(){
          shell.openExternal('http://ryaneghrari.com')
        }},
        {type:"separator"},
        {label:"Exit",click(){app.quit()}},
      ]
    }
  ])

  Menu.setApplicationMenu(menu);

  ipcMain.on('createNewWindow',function(event,searchTxt){
    //console.log(searchTxt)
    createSearchWindow(searchTxt)
  })


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here


function createSearchWindow(searchTxt){

  const modalPath = path.join('file://',__dirname,'src/prices/prices.html')

  // let win = new BrowserWindow({frame: false, transparent: true, width: 400, height: 200})
  let win = new BrowserWindow({alwaysOnTop:true, width: 800, minWidth: 600, height: 600, minHeight:400})

  //win.webContents.openDevTools()

  win.on('close',function(){ win = null})
  win.loadURL(modalPath)

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('searchTxt', searchTxt)
  })

  //send the new window the search value
  //win.webContents.send("searchTxt", "from main:" + searchTxt);

  win.show();
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
