
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import ReactIframe from 'src/commonComponents/ReactIframe'
import CommonBreadcrumb from 'src/commonComponents/commonBreadcrumb';
import ConsoleChildren from './consoleChildren';
import commonStyles from 'src/view/system/index.scss';
import { Button, Icon, notification } from "antd";
import ConsoleModel from './consoleModel';
import style from 'src/view/businessCenter/index.scss';
import { _fetchVerify } from "src/services/operationAnalysis";
import styles from "./index.scss";


const hostname = location.hostname; //获取服务器ip地址

export default class ConsoleManage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      settingVisible: false,
      loading: false,
      termWindow: false,
      buttonVisible: true,
      verifyValue: true,
      username:"",
      password:""
    };
  }

  verify = (data) => {
    this.setState({
      loading: true,
    })
    const body = {
      host: hostname,
      username: data.username,
      password: data.password
    }
    _fetchVerify(body).then(res => {
      if (!res) {
        this.setState({
          verifyValue: res,
          loading: false
        })
      } else {
        this.setState({
          settingVisible: false,
          termWindow: true,
          buttonVisible: false,
          username:data.username,
          password:data.password
        })
      }
    })
  }

  //操作弹窗
  handleToggleVisible = (key, value) => {
    if (key === 'addVmVisible') {
      this.setState({
        [key]: value,
        isEdit: false,
      })
    } else {
      this.setState({
        [key]: value,
      })
    }
  };

  render() {
    const { loading, settingVisible, termWindow, buttonVisible, verifyValue,username,password } = this.state
    const { routes } = this.props;
    let appletURL = "";
    let host = window.location.href.substr(
      0,
      window.location.href.indexOf("/navroute/")
    );
    let remoteIP = window.location.hostname;
    appletURL = `${host}/term/webssh.html?host=${remoteIP}&username=${username}&password=${password}`;

    return (
      <Fragment>
        <div className={style.bussinessHeader}>
          <CommonBreadcrumb routes={routes} />
        </div>
        <div className={commonStyles.content}>
          {
            buttonVisible ?
              <div className={styles.top}>
                <Button onClick={this.handleToggleVisible.bind(this, 'settingVisible', true)}><Icon type="setting" />参数设置</Button>
              </div> : null
          }

          {
            termWindow ? <div className={styles.termContainer} >
              <ReactIframe url={appletURL} height={480}/>
            </div> : null
          }
          {
            settingVisible && <ConsoleModel
              visible={true}
              onCancel={this.handleToggleVisible.bind(this, 'settingVisible', false)}
              onOk={this.verify}
              width={600}
              loading={loading}
              verifyValue={verifyValue}
            />
          }
        </div>
      </Fragment>
    );
  }
}
