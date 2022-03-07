import React from 'react'
import StockModal from '../StockModal'
import { ipcRenderer } from 'electron'
export default function (that) {
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
                    <StockModal edit={true} data={total}></StockModal>
                </>
            }
        },
    ];
    return columns
}
