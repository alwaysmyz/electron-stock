import React from 'react'
import './index.less'
import { ipcRenderer } from 'electron'
import StockModal from '../StockModal'
import { Table, Button, message } from 'antd'
import axios from 'axios'
import tableConfig from './table'
export default class StockManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            test: 1,
            show: false,
            data: [],
            stock_list: [],
            edit: false,
            editData: {}
        }
    }
    onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    }
    componentDidMount() {
        ipcRenderer.on('showAllStocks', (event, args) => {
            this.makeTableData(args)
            let list = args.map((item) => {
                return item.stock_code
            })
            this.setState({ stock_list: list }, () => {
                axios.get('https://qt.gtimg.cn/q=' + this.state.stock_list.join(',')).then(res => {
                    if (res.status === 200) {
                        //数据正常的话就直接处理
                        this.getPrice(res.data)
                    } else {
                        message.error('接口无法获取数据啦！')
                    }
                })
            })
        })
        setInterval(() => {
            // console.log('setInterval')
            if (this.state.stock_list !== []) {
                axios.get('https://qt.gtimg.cn/q=' + this.state.stock_list.join(',')).then(res => {
                    // console.log('res', res)
                    if (res.status === 200) {
                        //数据正常的话就直接处理
                        this.getPrice(res.data)
                    } else {
                        message.error('接口无法获取数据啦！')
                    }
                })
            }
        }, 1000)
    }
    getPrice = (stockData) => {
        let dataArr = stockData.split('\n')
        // console.log('getPrice', dataArr)
        let infoArr = dataArr.map((item) => {
            let infoArr = item.split('~')
            return {
                stock_name: infoArr[1],
                stock_price:infoArr[3],
            }
        })
        //更新数据信息
        let { data } = this.state;
        data = data.map((item, index) => {
            let { key,
                stock_code,
                stock_name,
                stock_price,
                prime_cost,
                stock_number,
                total_cost,
                earning_rate,
                earning_number,
                expected_prices,
                stock_account,
                current_price } = item
            let curEarningMoney = (Number(infoArr[index].stock_price) - prime_cost) * stock_number
            return {
                key: index,
                stock_code,
                stock_name:infoArr[index].stock_name,
                stock_price: Number(infoArr[index].stock_price).toFixed(2),
                prime_cost,
                stock_number,
                total_cost: prime_cost * stock_number,
                earning_rate: (curEarningMoney / (prime_cost * stock_number)).toFixed(2),
                earning_number: curEarningMoney.toFixed(2),
                expected_prices,
                stock_account,
                current_price: (Number(infoArr[index].stock_price) * stock_number).toFixed(2),
            }
        })
        this.setState({ data })
        // console.log('infoArr data', data)
    }
    makeTableData = (data) => {
        let tableData = data.map((item, index) => {
            const { stock_code, stock_name, prime_cost, stock_number, stock_account, expected_prices } = item
            return {
                key: index,
                stock_code,
                stock_name,
                stock_price: 80,
                prime_cost,
                stock_number,
                total_cost: 1000,
                earning_rate: '100%',
                earning_number: 100,
                expected_prices,
                stock_account,
                current_price: 1000,
            }
        })
        this.setState({ data: tableData })
    }
    render() {
        const { show, data, edit,editData} = this.state;
        return (
            <div className="stock_management_body">
                <div className="action_area">
                    <StockModal></StockModal>
                </div>
                <div className="table_wrapper">
                    <Table columns={tableConfig(this)} dataSource={data} onChange={this.onChange} />
                </div>
            </div>
        )
    }
};