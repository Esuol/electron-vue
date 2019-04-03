// Modules to control application life and create native browser window
const {app, BrowserWindow, globalShortcut, dialog} = require('electron')

const debug = /--debug/.test(process.argv[2])

if (process.env.NODE_ENV === 'DEV') app.setName('Electron APIs')

const path = require('path')
const glob = require('glob')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow


function initialize () {
  makeSingleInstance()
  loadDemos()

  function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 1080,
      minWidth: 680,
      height: 840,
      title: app.getName(),
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false
      },
    })

    let url
      if (process.env.NODE_ENV === 'DEV') {
        url = 'http://localhost:8090/'
      } else {
        url = `file://${app.getAppPath()}/dist/index.html`
      }


    // and load the index.html of the app.
    mainWindow.loadURL(url)

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    //debug
    if (debug) {
      mainWindow.webContents.openDevTools()
      mainWindow.maximize()
      require('devtron').install()
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null
    })


    globalShortcut.register('Command+k', () => {
      dialog.showMessageBox({
        type: 'info',
        message: '成功',
        detail: '按下了全局注册的快捷键绑定',
        buttons: ['好的']
      })
    })

  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)

  // Quit when all windows are closed.
  app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
  })

  app.on('will-quit', () => {
    globalShortcut.unregisterAll()
  })

  function makeSingleInstance () {
    if (process.env.NODE_ENV === 'PROD') return

    app.requestSingleInstanceLock()

    app.on('second-instance', () => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
      }
    })
  }

}

function loadDemos () {
  const files = glob.sync(path.join(__dirname, './main-process/**/*.js'))
  files.forEach((file) => { require(file) })
}




initialize()

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.