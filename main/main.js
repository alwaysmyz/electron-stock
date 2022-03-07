const { app, BrowserWindow,ipcMain } = require('electron')
const { env } = require('../config/index.json')
const { StockStore } = require('./StockStore')
const path = require('path')
const Store=new StockStore()
// const log =require('electron-log')
function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        },
    })
    console.log('env',env)
    if (env === 'production') {
        //生产环境
        // log.info('生产环境')
        win.loadFile(path.resolve(__dirname, '../render/dist/index.html'))
    } else {
        //开发环境
        // log.info('开发环境')
        win.webContents.openDevTools()
        win.loadURL('http://localhost:3000')
        // win.loadFile(path.resolve(__dirname, '../render/dist/index.html'))
    }
    return win
}
app.whenReady().then(() => {
    const window = createWindow()
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