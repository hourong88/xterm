import React, { Component } from 'react'
import MyIcon from "src/commonComponents/Icon";
import ConsoleModel from './consoleModel';
import CommonBreadcrumb from 'src/commonComponents/commonBreadcrumb';
import { Button, Icon, notification } from "antd";
import commonStyles from 'src/view/system/index.scss';
import proxyIp from "src/setupProxyIp";
import styles from "./index.scss";
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import {
  _fetchVerify,
} from "src/services/operationAnalysis";

// import { AttachAddon } from 'xterm-addon-attach';
// import openSocket from 'socket.io-client';
import './xterm.css'
// import { TRUE } from 'node-sass';

const fitAddon = new FitAddon();
const hostname = location.hostname; //获取服务器ip地址


let term = new Terminal({
  // cursorStyle: 'underline', //光标样式
  cursorBlink: true, // 光标闪烁
  convertEol: true, //启用时，光标将设置为下一行的开头
  disableStdin: false, //是否应禁用输入。
  scrollback: 800,
  row: 70,
  theme: {
    foreground: '#ffffff', //字体
    background: '#181E29', //背景色
  }
});

export default class ConsoleManage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      settingVisible: false,
      loading: false,
      termWindow: false,
      buttonVisible: true,
      verifyValue: true,
    };
  }

  componentDidMount() {
     
  }
  
  componentWillUnmount(){
     setTimeout(function(){ 
      term.writeln('命令行已销毁，如需使用，请按F5强制刷新此页面,再重新连接');
      term.dispose()
      }, 3000);
    // var div = document.getElementById('terminal');
    // div.removeEventListener('click',returnedFunction,false);
    // term.clear()
  }

  termInit = () => {
    //让xterm的窗口适应外层的style
    term.loadAddon(fitAddon);
    // fitAddon.fit();
    //显示xterm窗口
    term.open(document.getElementById('terminal'));
    //初始化之前
    term.writeln('Connecting...');
  

  }
  //连接
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
      }else{
        this.connect(data)
      }
    })

  }
  
  //这里的注释是调试过程中写的，可以做参考，最终上线没有用以下注释的这段代码。

  // success = (values) => {
  //   this.setState({
  //     settingVisible: false,
  //     termWindow: true,
  //     buttonVisible: false
  //   }, () => {
  //     //连接成功，与后端验证用户名和密码
  //     const option = {
  //       operate: 'connect',
  //       host: hostname,//IP
  //       port: '22',//端口号
  //       username: 'root',//用户名
  //       password: 'password',//密码*/
  //       module: "webssh"
  //     }
  //     //初始化
  //      this.termInit()
  //     // 换行并输入起始符“$”
  //     term.prompt = () => {
  //       term.write("\r\n$ ");
  //     };
  //     //定义与后端服务器连接地址
  //     let socket = new WebSocket(`ws://192.168.2.180:8080/webssh`);
  //     //键盘输入内容传给后端的方法
  //     term.onKey(e => {
  //       // console.log(e.key)
  //       socket.send(JSON.stringify({ "operate": "command", "command": e.key, module: "webssh" }));

  //     })
  //     //操作回调
  //     const operate = {
  //       onError: function (error) {
  //         //连接失败回调
  //         notification.error({
  //           message: "连接超时，请检查您的网络或输入的参数",
  //         });
  //         term.write('Error: ' + error + '\r\n');
  //       },
  //       onConnect: function () {
  //         //连接成功回调
  //         socket.send(JSON.stringify(option))  //连接成功的回调
  //       },
  //       onClose: function () {
  //         //连接关闭回调
  //         term.write("\rconnection closed");
  //       },
  //       onData: function (data) {
  //         //收到数据时回调
  //         term.write(data);
  //         term.focus()
  //       }
  //     }
  //     if (window.WebSocket) {
  //       //如果支持websocket
  //       // this._connection = new WebSocket(endpoint);
  //       console.log("good!!!")
  //     } else {
  //       //否则报错
  //       operate.onError('WebSocket Not Supported');
  //       return;
  //     }
  //     //连接成功
  //     socket.onopen = function () {
  //       operate.onConnect()
  //     };

  //     socket.onmessage = function (evt) {
  //       let data = evt.data.toString();
  //       //data = base64.decode(data);
  //       console.log("data", data)
  //       operate.onData(data);
  //     };

  //     socket.onclose = function (evt) {
  //       operate.onClose();
  //     };

  //   });
  // }

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

  connect = (data) => {
    this.setState({
      settingVisible: false,
      termWindow: true,
      buttonVisible: false
    }, () => {
      this.handleToggleVisible.bind(this, 'settingVisible', false)
      //连接成功，与后端验证用户名和密码
      const option = {
        operate: 'connect',
        host: hostname,//IP
        port: '22',//端口号
        username: data.username,//用户名
        password: data.password,//密码*/
        module: "webssh"
      }
      //初始化
      this.termInit()
      // 换行并输入起始符“$”
      term.prompt = () => {
        term.write("\r\n$ ");
      };
      //定义与后端服务器连接地址
       let socket =   process.env.NODE_ENV === "production"
       ? new WebSocket(`ws://${host.split(":")[0]}:8008/websocket`)
       : new WebSocket(
         `ws${proxyIp.ip.slice(4).replace(/[0-9]{4}$/, "8008/websocket")}`
       );
      
      //键盘输入内容传给后端的方法
      term.onKey(e => {
        // console.log(e.key)
        socket.send(JSON.stringify({ "operate": "command", "command": e.key, module: "webssh" }));

      })
      //操作回调
      const operate = {
        onError: function (error) {
          //连接失败回调
          notification.error({
            message: "连接超时，请检查您的网络或输入的参数",
          });
          term.write('Error: ' + error + '\r\n');
        },
        onConnect: function () {
          //连接成功回调
          socket.send(JSON.stringify(option))  //连接成功的回调
        },
        onClose: function () {
          //连接关闭回调
          term.write("\rconnection closed");
        },
        onData: function (data) {
          //收到数据时回调
          term.write(data);
          term.focus()
        }
      }
      if (window.WebSocket) {
        //如果支持websocket
        // this._connection = new WebSocket(endpoint);
        console.log("good!!!")
      } else {
        //否则报错
        operate.onError('WebSocket Not Supported');
        return;
      }
      //连接成功
      socket.onopen = function () {
        operate.onConnect()
      };

      socket.onmessage = function (evt) {
        console.log(evt,evt);
        let data = evt.data.toString();
        console.log(data,"data");
        switch (data) {
          case '\r': 
          break;
          case '\u0003': 
            prompt(term);
            break;
          case '\u007F':
            if (term._core.buffer.x > 2) {
              term.write('\b \b');
            }
            break;
          default:
          term.write(data);
        }
      };

      socket.onclose = function (evt) {
        operate.onClose();
      };

    });
  };


  render() {

    const { loading, settingVisible, termWindow, buttonVisible, verifyValue } = this.state
    return (
      <React.Fragment>
        <div className={commonStyles.content}>
         
        {
            buttonVisible ?
              <div className={styles.top}>
                <Button onClick={this.handleToggleVisible.bind(this, 'settingVisible', true)}><Icon type="setting" />参数设置</Button>
              </div> : null
          }
          
          {
            termWindow ? <div className={styles.termContainer} >
              <div id="terminal" className={styles.xterm}></div>
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
      </React.Fragment>
    )
  }
}
