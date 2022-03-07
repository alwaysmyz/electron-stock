import React from 'react'
import './index.less'
import { ipcRenderer } from 'electron'
import { Modal, Form, Input, Typography, Space, Select, Divider, message, Button, InputNumber } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
const { Option } = Select
const formRef = React.createRef();
export default class StockModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: ['华泰', '中信', '银河', '华宝'],
            name: '',
            show: false,
        }
    }
    componentDidMount() {
    }
    //显示modal
    showModel = () => {
        if (this.props.edit === true) {
            const { stock_code, prime_cost, stock_number, expected_prices, stock_account } = this.props.data;
            setTimeout(() => {
                formRef.current.setFieldsValue({
                    stock_code,
                    prime_cost,
                    stock_number,
                    expected_prices,
                    stock_account
                });
            },100)
        }
        this.setState({
            show: true,
        })
    }
    handleOk = (values) => {
        //添加相关信息
        ipcRenderer.send('addStock', values)
        this.handleCancel()
    }
    handleCancel = () => {
        this.setState({
            show: false,
        })
    }
    //添加一个账户
    addItem = () => {
        const { name } = this.state;
        //如果名字为空 则不允许添加
        if (name === undefined) {
            return message.error('账户名称不能为空')
        }
        const { items } = this.state;
        items.push(name);
        this.setState({ items, name: '' })
    }
    //选择的名字改变
    onNameChange = (e) => {
        this.setState({
            name: e.target.value
        })
    }
    //删除多余的账户
    deleteItem = (e, name) => {
        e.stopPropagation()
        let { items } = this.state;
        items = items.filter((i) => i !== name)
        this.setState({ items })
    }
    render() {
        const { items, show } = this.state;
        const { edit } = this.props
        return (
            <>
                {edit === undefined ? <Button type="primary" onClick={() => { this.showModel() }}>添加信息</Button> : <a onClick={() => { this.showModel() }}>编辑</a>}
                <Modal
                    class='stock-model'
                    title="添加一个新的"
                    visible={show}
                    onOk={() => this.handleOk()}
                    onCancel={() => this.handleCancel()}
                    footer={null}
                >
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        onFinish={(v) => this.handleOk(v)}
                        ref={formRef}
                    >
                        <Form.Item
                            label="代码"
                            name="stock_code"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>
                        {/* <Form.Item
                        label="名称"
                        name="stock_name"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input />
                    </Form.Item> */}
                        <Form.Item
                            label="成本"
                            name="prime_cost"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <InputNumber />
                        </Form.Item>
                        <Form.Item
                            label="数量"
                            name="stock_number"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <InputNumber />
                        </Form.Item>
                        <Form.Item
                            label="预期价格"
                            name="expected_prices"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <InputNumber />
                        </Form.Item>
                        <Form.Item
                            label="所在账户"
                            name="stock_account"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Select
                                style={{ width: 300 }}
                                placeholder="选择所在账户"
                                dropdownRender={menu => (
                                    <>
                                        {menu}
                                        <Divider style={{ margin: '8px 0' }} />
                                        <Space align="center" style={{ padding: '0 8px 4px' }}>
                                            <Input placeholder="Please enter item" onChange={(e) => this.onNameChange(e)} />
                                            <Typography.Link onClick={() => this.addItem()} style={{ whiteSpace: 'nowrap' }}>
                                                Add item
                                            </Typography.Link>
                                        </Space>
                                    </>
                                )}
                            >
                                {items.map(item => (
                                    <Option key={item}>{item}<span onClick={(e) => this.deleteItem(e, item)}><DeleteOutlined /></span></Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        )
    }
};