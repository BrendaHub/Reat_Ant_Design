import React from 'react'
import Child from './Child'
import {Button,Input} from 'antd'
import './index.less'
export default class Life extends React.Component{
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         count:0
    //     };
    // }

    state = {
        count:0,
        refs:{
            name:"antd",
            address:"_address",
            url:"https://www.ant-loiter.com"
        }
    }

    handleAdd=()=>{
        this.setState({
            count: this.state.count + 1
        })
    }

    handleClick(){
        this.setState({
            count: this.state.count + 1
        })
    }

    render(){
        // can defined style and refrence this variable
        let style = {
            padding:50
        }
        return <div className="content">
            <p>React生命周期介绍</p>
            <Input></Input>
            <Button onClick={this.handleAdd} type="primary">AntD点击一下</Button>
            <button onClick={this.handleAdd}>点击一下</button>
            <button onClick={this.handleClick.bind(this)}>点击一下</button>
            <p>{this.state.count}</p>
            {/**以下是一种父子组件的传值 ；  */}
            <Child name={this.state.count} objvalue={this.state.refs}></Child>
        </div>
    }
}