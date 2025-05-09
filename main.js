const { app, BrowserWindow } = require('electron')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
  })

  // In development
  if (isDev) {
    win.loadURL('http://localhost:3000')
  } else {
    // In production, load from the .next/server/app directory
    win.loadFile(path.join(__dirname, '.next/server/app/index.html'))
  }

  // Inject CSS to prevent log overflow
  win.webContents.on('did-finish-load', () => {
    win.webContents.insertCSS(`
      .log-container, .log-line, pre, code {
        box-sizing: border-box !important;
        max-width: 100% !important;
        overflow-x: hidden !important; /* Disable horizontal scrolling */
        overflow-y: auto !important;
        white-space: pre-wrap !important;
        word-wrap: break-word !important; /* Ensure long words break properly */
        word-break: break-word !important;
      }
      .log-container {
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        padding: 0.5em 0.5em !important;
        margin: 0 !important;
        overflow: auto !important;
        background-color: #f9f9f9 !important; /* Optional: Add a background for better readability */
      }
    `)
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})