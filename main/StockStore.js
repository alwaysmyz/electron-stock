const Store=require('electron-store')
class StockStore extends Store{
    constructor(settings) {
        super(settings)
        this.stocks=this.get('stock')||[]
    }
    saveStocks() {
        this.set('stock', this.stocks)
        console.log('set中的get',this.get('stock'))
        return this
    }
    getStock() {
        return this.stocks||[]
    }
    //添加某个
    addStock(stock) {
        this.stocks = this.stocks.concat(stock)
        console.log('addStock',this.stocks)
        return this.saveStocks()
    }
    //删除某个
    deleteStock(stockCode) {
        this.stocks = this.stocks.filter(curStock => {
            return stockCode !== curStock.stock_code
        })
        return this.saveStocks()
    }
}
module.exports = { StockStore }