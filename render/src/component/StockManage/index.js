import React from 'react'
import './index.less'
import { ipcRenderer } from 'electron'
import StockModal from '../StockModal'
import { Table, Button, message } from 'antd'
import axios from 'axios'
const columns = [
    {
        title: '代码',
        dataIndex: 'stock_code',
    },
    {
        title: '名称',
        dataIndex: 'stock_name',
    },
    {
        title: '单价',
        dataIndex: 'stock_price',
        sorter: {
            compare: (a, b) => a.stock_price - b.stock_price,
            multiple: 3,
        },
    },
    {
        title: '成本',
        dataIndex: 'prime_cost',
        sorter: {
            compare: (a, b) => a.prime_cost - b.prime_cost,
            multiple: 2,
        },
    },
    {
        title: '数量',
        dataIndex: 'stock_number',
        sorter: {
            compare: (a, b) => a.english - b.english,
            multiple: 1,
        },
    },
    {
        title: '持仓',
        dataIndex: 'total_cost',
        sorter: {
            compare: (a, b) => a.english - b.english,
            multiple: 1,
        },
    },
    {
        title: '收益率',
        dataIndex: 'earning_rate',
        sorter: {
            compare: (a, b) => a.english - b.english,
            multiple: 1,
        },
    },
    {
        title: '收益额',
        dataIndex: 'earning_number',
        sorter: {
            compare: (a, b) => a.english - b.english,
            multiple: 1,
        },
    },
    {
        title: '预期价格',
        dataIndex: 'expected_prices',
        sorter: {
            compare: (a, b) => a.english - b.english,
            multiple: 1,
        },
    },
    {
        title: '所在账户',
        dataIndex: 'stock_account',
        sorter: {
            compare: (a, b) => a.english - b.english,
            multiple: 1,
        },
    },
    {
        title: '市值',
        dataIndex: 'current_price',
        sorter: {
            compare: (a, b) => a.english - b.english,
            multiple: 1,
        },
    },
    {
        title: '操作',
        dataIndex: 'delete',
        render: (item, total) => {
            return <>
                <a onClick={() => {
                    ipcRenderer.send('deleteStock', total.stock_code);
                }}>
                    删除
                </a>
                <a onClick={() => {
                    this.setState({
                        edit: true, 
                        editData:total
                    })
                }}>
                    编辑
                </a>
            </>
        }
    },
];
// const data = [
//     {
//         key: '1',
//         stock_code: 'sh110038',
//         stock_name: '济川转债',
//         stock_price: 60,
//         prime_cost: 70,
//         stock_number: 1,
//         total_cost: 1000,
//         earning_rate: '100%',
//         earning_number: 100,
//         expected_prices: 200,
//         stock_account: '华泰',
//         current_price: 1000,
//     },
//     {
//         key: '2',
//         stock_code: 'sh110038',
//         stock_name: '济川转债',
//         stock_price: 70,
//         prime_cost: 70,
//         stock_number: 1,
//         total_cost: 1000,
//         earning_rate: '100%',
//         earning_number: 100,
//         expected_prices: 200,
//         stock_account: '华泰',
//         current_price: 1000,
//     },
//     {
//         key: '3',
//         stock_code: 'sh110038',
//         stock_name: '济川转债',
//         stock_price: 80,
//         prime_cost: 70,
//         stock_number: 1,
//         total_cost: 1000,
//         earning_rate: '100%',
//         earning_number: 100,
//         expected_prices: 200,
//         stock_account: '华泰',
//         current_price: 1000,
//     },
//     {
//         key: '4',
//         stock_code: 'sh110038',
//         stock_name: '济川转债',
//         stock_price: 80,
//         prime_cost: 30,
//         stock_number: 1,
//         total_cost: 1000,
//         earning_rate: '100%',
//         earning_number: 100,
//         expected_prices: 200,
//         stock_account: '华泰',
//         current_price: 1000,
//     },
// ];
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
    openModal = () => {
        this.setState({ show: true })
    }
    closeModal = () => {
        this.setState({ show: false })
    }
    onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    }
    componentDidMount() {
        console.log('主页面')
        ipcRenderer.on('showAllStocks', (event, args) => {
            console.log('渲染进程showAllStocks', args)
            this.makeTableData(args)
            let list = args.map((item) => {
                return item.stock_code
            })
            console.log('list', list, list.join(','))
            this.setState({ stock_list: list }, () => {
                axios.get('https://qt.gtimg.cn/q=' + this.state.stock_list.join(',')).then(res => {
                    console.log('res', res)
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
        let priceArr = dataArr.map((item) => {
            let infoArr = item.split('~')
            return infoArr[3]
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
            let curEarningMoney = (Number(priceArr[index]) - prime_cost) * stock_number
            return {
                key: index,
                stock_code,
                stock_name,
                stock_price: Number(priceArr[index]).toFixed(2),
                prime_cost,
                stock_number,
                total_cost: prime_cost * stock_number,
                earning_rate: (curEarningMoney / (prime_cost * stock_number)).toFixed(2),
                earning_number: curEarningMoney.toFixed(2),
                expected_prices,
                stock_account,
                current_price: (Number(priceArr[index]) * stock_number).toFixed(2),
            }
        })
        this.setState({ data })
        // console.log('priceArr data', data)
    }
    makeTableData = (data) => {
        let tableData = data.map((item, index) => {
            const { stock_code, stock_name, prime_cost, stock_number, stock_account, expected_prices } = item
            console.log('makeTableData', {
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
            })
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
        const { show, data, edit } = this.state;
        return (
            <div className="stock_management_body">
                <div className="action_area">
                    <Button type="primary" shape="round" size={'large'} onClick={() => this.openModal()}>
                        添加信息
                    </Button>
                </div>
                <div className="table_wrapper">
                    <Table columns={columns} dataSource={data} onChange={this.onChange} />
                </div>
                {edit === false ? <StockModal show={show} cancelModel={() => this.closeModal()}></StockModal> : <StockModal show={show} data={editData} cancelModel={() => this.closeModal()}></StockModal>}
            </div>
        )
    }
};