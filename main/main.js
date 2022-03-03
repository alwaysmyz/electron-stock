const { app, BrowserWindow,ipcMain } = require('electron')
const { env } = require('../config/index.json')
const { StockStore } = require('./StockStore')
const Store=new StockStore()
const log =require('electron-log')
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        },
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
    ipcMain.on('addStock', (event, args) => {
        console.log('args', [args])
        Store.addStock(args)
        //添加之后马上向渲染进程传递
        window.send('showAllStocks',Store.getStock())
        console.log('存储的结果是',Store.getStock())
    })
    ipcMain.on('deleteStock', (event, args) => {
        console.log('deleteStock args', [args])
        Store.deleteStock(args)
        //添加之后马上向渲染进程传递
        window.send('showAllStocks',Store.getStock())
    })
    window.webContents.on('did-finish-load', () => {
        window.send('showAllStocks',Store.getStock())
    })
    console.log('存储的位置',app.getAppPath('userData'))
})