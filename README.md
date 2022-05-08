This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)

说明：这个是基于xterm.js和websocket的react命令行终端demo

主要看**consoleManagement**文件夹，实际业务中是调试可行上线的。

需求：react框架，单个页面，用户名和密码连接远程服务器，本页面可以xterm控制远程服务器。通信方式是websoket连接。

主要调用xterm的几个方法：
- onError
- onConnect
- onClose
- onData

具体内容看注释


**相关文档：**
https://xtermjs.org/
https://xtermjs.org/docs/api/terminal/classes/terminal/
https://xtermjs.org/docs/api/addons/fit/

最终实现效果，类似这样的：
https://xtermjs.org/blog/articles/2017-02-08-xtermjs-2.3


后续更新直接将可行的业务代码复制进去了，安装是跑不起来的，下载了直接看consoleManagement文件夹配合文档进行调试即可


关键代码：
```js
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
  ```
