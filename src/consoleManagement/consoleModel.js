import React, { useCallback } from 'react';
import { useAsync } from '@umijs/hooks';
import { regxs } from 'src/utils/RegxPattern';
import { Form, Modal, Input, Select, notification, message,Spin } from 'antd';
import { _queryVirtualMachineDis } from 'src/services/virtualDatacenter';
const FormItem = Form.Item;
const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 6 }
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 14 }
	}
};

let ConsoleModel = (props) => {

	const { vmData, onOk, onCancel, visible, form ,verifyValue,loading} = props;
	const { getFieldDecorator, validateFields } = form;
	const submit = useCallback(() => {
		validateFields((err, values) => {
			if (err) {
				console.log(err);
				return message.info('请完整填写表单');
			} else {
				onOk({
					username: values.username,
					password: values.password
				});
			}
		})
	}, []);

	return (
		<Modal
			title={'控制台参数设置'}
			visible={visible}
			okButtonProps={{
				loading
			}}
			width={600}
			destroyOnClose={true}
			onOk={submit}
			onCancel={onCancel}
			maskClosable={false}
		>
			 {/* <Spin spinning={loading}> */}
			<div style={{ paddingLeft: "50px" }}>
				<FormItem label="用户名" {...formItemLayout}>
					{getFieldDecorator("username", {
						// initialValue: username,
						rules: [
							{ required: true, message: '请输入用户名' },
							{ pattern: new RegExp(regxs.userName), message: regxs.messageUserName }
						]
					})(<Input />)}
				</FormItem>
				<FormItem label="密码" {...formItemLayout}>
					{getFieldDecorator("password", {
						// initialValue: password,
						rules: [{
							required: true,
							message: '请输入密码'
						}]
					})(<Input.Password type='password' />)}
				</FormItem>
				{!verifyValue?<div style={{color: "#f9b34f",marginRight: "200px",marginTop:"-24px",fontSize: "12px",textAlign:"right"}}>
                用户名或密码无效，请重新输入
              </div>:null}
				
			</div>
			{/* </Spin> */}
		</Modal>
	)
};
ConsoleModel = Form.create()(ConsoleModel);

export default ConsoleModel;