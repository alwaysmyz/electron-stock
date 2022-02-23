const { app, BrowserWindow } = require('electron')
const { env } = require('../config/index.json')
const log =require('electron-log')
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
    })
    console.log('env',env)
    if (env === 'production') {
        //生产环境
        log.info('生产环境')
        win.loadFile('./render/public/index.html')
    } else {
        //开发环境
        log.info('开发环境')
        win.loadURL('http://localhost:3000')
    }
    return win
}
app.whenReady().then(() => {
    const window = createWindow()
    window.webContents.openDevTools()
})