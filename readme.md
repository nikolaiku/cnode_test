#### 目的
+ 重新定义页面逻辑跳转
+ 增加页面样式
+ 增加了对用户权限的操作
+ 增加node和浏览器都可以用的调用接口

#### 运行
+ npm install / yarn install
+ npm run dev

#### 线上地址
+ http://192.144.204.141:2333

#### linux上安装mongodb
+ curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel62-3.6.4.tgz # 下载
+ tar -zxvf mongodb-linux-x86_64-rhel62-3.6.4.tgz # 解压
+ mv mongodb-linux-x86_64-rhel62-3.6.4/ /usr/local/mongodb # 将解压包拷贝到指定目录
+ vi /etc/profile 打开文件进行编辑
    1. export MONGODB_HOME=/usr/local/mongodb  
    1. export PATH=$PATH:$MONGODB_HOME/bin  
+ 输入:wq 进行保存并退出
+ 重启系统配置source /etc/profile
+ cd /usr/local/mongodb/bin  
+ vi mongodb.conf 
    1. dbpath=/usr/local/mongodb/data
    1. logpath=/usr/local/mongodb/logs/mongod.log
    1. logappend=true
    1. fork=true
    1. port=27017
+ 输入:wq 进行保存并退出
+ 启动mongod数据库服务 ./mongod -f mongodb.conf
+ 进入mongodb数据库 ./mongo

+ 停止服务：./mongod -shutdown -dbpath=/usr/local/mongodb/data
+ 通过端口状态查看mongodb的启动状态 netstat -lanp | grep "27017"