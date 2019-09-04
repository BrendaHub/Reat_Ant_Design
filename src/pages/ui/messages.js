import React from 'react'
import { Card, Button, message } from 'antd'
import './ui.less'
export default class Buttons extends React.Component {

    state = {
        lable: "2分钟倒计时",
        count: 120
    }

    showMessage = (type)=>{
        console.log("type = " + type);
        message[type]("恭喜你，React课程晋级成功");
    }

     showMessagetimeout = () =>{
        const mesg = message.loading("loading message 10 second level")
        setTimeout(() => {
            mesg
        }, 10000);
    }

    countDownFun =()=>{
        // let that = this;
       const countdownval = setInterval(() => {
            console.log(">>"+this.state.count)
            if(this.state.count > 0 ){
                this.setState({
                    count: this.state.count - 1,
                    lable: this.state.count + "second"
                })
            }else{
                clearInterval(countdownval)
            }
            
        }, 1000);
    }

    render(){
        return (
            <div>
                <Card title="全局提示框" className="card-wrap">
                    <Button type="primary" onClick={()=>this.showMessage('success')}>Success</Button>
                    <Button type="primary" onClick={()=>this.showMessage('info')}>Info</Button>
                    <Button type="primary" onClick={()=>this.showMessage('warning')}>Warning</Button>
                    <Button type="primary" onClick={()=>this.showMessage('error')}>Error</Button>
                    <Button type="primary" onClick={()=>this.showMessage('loading')}>Loading</Button>
                    {/** 带参数的事件函数需要写以下面这种样子 */}
                    <Button type="primary" onClick={this.showMessagetimeout}>10second level my self defined</Button>
                    {/**在按钮上倒计归 */}
                    <Button type="primary" onClick={this.countDownFun}>{this.state.lable}</Button>
                </Card>
            </div>
        );
    }
}