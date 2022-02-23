import React from 'react'
import './index.less'
export default class StockManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            test:1,
        }
    }
    render() {
        console.log('StockManage 页面渲染')
        return (
            <div>
                stockManage页面
                <div>
                    test
                </div>
            </div>
        )
    }
};