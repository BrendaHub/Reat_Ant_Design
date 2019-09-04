import React from 'react'
import { Card, Button, Form, Select, Modal, Input, Tree, Transfer } from 'antd'
import ETable from './../../components/ETable'
import Utils from './../../utils/utils'
import axios from './../../axios'
import menuConfig from './../../config/menuConfig'
const Option = Select.Option;
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
export default class PermissionUser extends React.Component {

    state = { }
    componentWillMount(){
        axios.requestList(this,'/role/list',{});
    }
    // 打开创建角色弹框
    handleRole=()=>{
        this.setState({
            isRoleVisible:true
        })
    }
    // 角色提交
    handleRoleSubmit=()=>{
        let data = this.roleForm.props.form.getFieldsValue();
        axios.ajax({
            url:'role/create',
            data:{
                params:data
            }
        }).then((res)=>{
            if(res.code ==0){
                this.setState({
                    isRoleVisible:false
                })
                this.roleForm.props.form.resetFields();
                axios.requestList(this, '/role/list', {});
            }
        })
    }

    // 权限设置
    handlePermission = ()=>{
        let item = this.state.selectedItem;
        if (!item){
            Modal.info({
                text:'请选择一个角色'
            })
            return;
        }
        this.setState({
            isPermVisible:true,
            detailInfo:item,
            menuInfo: item.menus
        })
    }

    handlePermEditSubmit = ()=>{
        let data = this.permForm.props.form.getFieldsValue();
        data.role_id = this.state.selectedItem.id;
        data.menus = this.state.menuInfo;
        axios.ajax({
            url:'/permission/edit',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isPermVisible:false
                })
                axios.requestList(this, '/role/list', {});
            }
        })
    }

    // 用户授权
    hanldeUserAuth = ()=>{
        let item = this.state.selectedItem;
        if (!item) {
            Modal.info({
                text: '请选择一个角色'
            })
            return;
        }
        this.setState({
            isUserVisible: true,
            detailInfo: item
        })
        this.getRoleUserList(item.id);
    }

    getRoleUserList = (id)=>{
        axios.ajax({
            url:'/role/user_list',
            data:{
                params:{
                    id
                }
            }
        }).then((res)=>{
            if(res){
                this.getAuthUserList(res.result);
            }
        })
    }

    // 筛选目标用户
    getAuthUserList = (dataSource)=>{
        const mockData = [];
        const targetKeys = [];
        if (dataSource && dataSource.length>0){
            for(let i=0;i< dataSource.length;i++){
                const data = {
                    key: dataSource[i].user_id,
                    title: dataSource[i].user_name,
                    status: dataSource[i].status
                }
                if(data.status == 1){
                    targetKeys.push(data.key);
                }
                mockData.push(data);
            }
            this.setState({
                mockData, targetKeys
            })
        }
    }
    // 用户授权提交
    handleUserSubmit = ()=>{
        let data = {}
        data.user_ids = this.state.targetKeys;
        data.role_id = this.state.selectedItem.id;
        axios.ajax({
            url:'/role/user_role_edit',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isUserVisible:false
                })
                axios.requestList(this, '/role/list', {});
            }
        })
    }
    render() {
        const columns = [
            {
                title:'角色ID',
                dataIndex:'id'
            }, {
                title: '角色名称',
                dataIndex: 'role_name'
            }, {
                title: '创建时间',
                dataIndex: 'create_time',
                render: Utils.formateDate
            }, {
                title: '使用状态',
                dataIndex: 'status',
                render(status){
                    return status == 1?'启用':'停用'
                }
            }, {
                title: '授权时间',
                dataIndex: 'authorize_time',
                render: Utils.formateDate
            }, {
                title: '授权人',
                dataIndex: 'authorize_user_name'
            }
        ]
        return (
            <div>
                <Card>
                    <Button type="primary" onClick={this.handleRole}>创建角色</Button>
                    <Button type="primary" style={{marginLeft:10,marginRight:10}} onClick={this.handlePermission}>设置权限</Button>
                    <Button type="primary" onClick={this.hanldeUserAuth}>用户授权</Button>
                </Card>
                <div className="content-wrap">
                    <ETable 
                        updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                        selectedRowKeys={this.state.selectedRowKeys}
                        dataSource={this.state.list}
                        columns={columns}
                    />
                </div>
                <Modal
                    title="创建角色"
                    visible={this.state.isRoleVisible}
                    onOk={this.handleRoleSubmit}
                    onCancel={()=>{
                        this.roleForm.props.form.resetFields();
                        this.setState({
                            isRoleVisible:false
                        })
                    }}
                >
                    <RoleForm wrappedComponentRef={(inst)=>this.roleForm=inst}></RoleForm>
                </Modal>
                <Modal
                    title="设置权限"
                    visible={this.state.isPermVisible}
                    width={600}
                    onOk={this.handlePermEditSubmit}
                    onCancel={()=>{
                        this.setState({
                            isPermVisible:false
                        })
                    }}
                >
                    <PermEditForm 
                        wrappedComponentRef={(inst) => this.permForm = inst}
                        detailInfo={this.state.detailInfo} 
                        menuInfo={this.state.menuInfo}
                        patchMenuInfo={(checkedKeys)=>{
                            this.setState({
                                menuInfo: checkedKeys
                            })
                        }}
                    />
                </Modal>
                <Modal
                    title="用户授权"
                    visible={this.state.isUserVisible}
                    width={800}
                    onOk={this.handleUserSubmit}
                    onCancel={() => {
                        this.setState({
                            isUserVisible: false
                        })
                    }}
                >
                    <RoleAuthForm
                        wrappedComponentRef={(inst) => this.userAuthForm = inst}
                        detailInfo={this.state.detailInfo}
                        targetKeys={this.state.targetKeys}
                        mockData={this.state.mockData}
                        patchUserInfo={(targetKeys)=>{
                            this.setState({
                                targetKeys
                            })
                        }}
                    />
                </Modal>
            </div>
        );
    }
}
class RoleForm extends React.Component {

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        }
        return (
            <Form layout="horizontal">
                <FormItem label="角色名称" {...formItemLayout}>
                    {
                        getFieldDecorator('role_name')(
                            <Input type="text" placeholder="请输入角色名称" />
                        )   
                    }
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                    {
                        getFieldDecorator('state')(
                            <Select>
                                <Option value={1}>开启</Option>
                                <Option value={0}>关闭</Option>
                            </Select>
                        )  
                    }
                </FormItem>
            </Form>
        );
    }
}
RoleForm = Form.create({})(RoleForm);

class PermEditForm extends React.Component{

    onCheck = (checkedKeys)=>{
        this.props.patchMenuInfo(checkedKeys)
    }

    renderTreeNodes = (data)=>{
        return data.map((item)=>{
            if(item.children){
                return <TreeNode title={item.title} key={item.key}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            }else{
                return <TreeNode {...item}/>
            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        }
        const detail_info = this.props.detailInfo;
        const menuInfo = this.props.menuInfo;
        return (
            <Form layout="horizontal">
                <FormItem label="角色名称" {...formItemLayout}>
                    <Input disabled placeholder={detail_info.role_name}/>
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                    {
                        getFieldDecorator('status',{
                            initialValue:'1'
                        })(
                            <Select>
                                <Option value="1">启用</Option>
                                <Option value="0">停用</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <Tree
                    checkable
                    defaultExpandAll
                    onCheck={(checkedKeys)=>{
                        this.onCheck(checkedKeys)
                    }}
                    checkedKeys={menuInfo}
                >
                    <TreeNode title="平台权限" key="platform_all">
                        {this.renderTreeNodes(menuConfig)}
                    </TreeNode>
                </Tree>
            </Form>
        );
    }
}
PermEditForm = Form.create({})(PermEditForm);

class RoleAuthForm extends React.Component {

    onCheck = (checkedKeys) => {
        this.props.patchMenuInfo(checkedKeys)
    }
    filterOption = (inputValue, option) => {
        return option.title.indexOf(inputValue) > -1;
    }
    handleChange = (targetKeys)=>{
        this.props.patchUserInfo(targetKeys);
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        }
        const detail_info = this.props.detailInfo;
        const menuInfo = this.props.menuInfo;
        return (
            <Form layout="horizontal">
                <FormItem label="角色名称" {...formItemLayout}>
                    <Input disabled placeholder={detail_info.role_name} />
                </FormItem>
                <FormItem label="选择用户" {...formItemLayout}>
                    <Transfer
                        listStyle={{width:200,height:400}}
                        dataSource={this.props.mockData}
                        titles={['待选用户', '已选用户']}
                        showSearch
                        searchPlaceholder='输入用户名'
                        filterOption={this.filterOption}
                        targetKeys={this.props.targetKeys}
                        onChange={this.handleChange}
                        render={item => item.title}
                    />
                </FormItem>
            </Form>
        );
    }
}
RoleAuthForm = Form.create({})(RoleAuthForm);